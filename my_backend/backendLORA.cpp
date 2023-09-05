#include <node.h>
#include <iostream>
#include <vector>
#include <cstdlib>
#include <cstdio>
#include <fstream>
#include <set>
#include <sstream>
#include <cmath>
#include <queue>
#include <assert.h>
#include <time.h>
#include <algorithm>
#include <time.h>
#include <map>
#include <cstring>
#include <algorithm>
#include <unordered_map>
#include "Node.h"
#include "utility.h"
#include "staticData.h"

map<string, vector<Node>> NodeMap;
map<string, vector<string>> LocationMap;
map<string, vector<vector<vector<int>>>> QueryMap;
map<string, map<string, set<int>>> InvertedMap;

vector<Node> NodeSet;
vector<string> LocationSet;
vector<vector<vector<int>>> QuerySet;
vector<string> keySet;

vector<vector<double>> SpatialVector;
map<string, set<int>> InvertedList;

vector<double> minLat;
vector<double> minLon;
vector<double> maxLat;
vector<double> maxLon;

int K = 0;
int D = 5;
double Rset = 1e+07;
int numMapping[10];
int COUNT = 0;
int LatSplitNum;
int LonSplitNum;
double rate_p = 1.5;
double latLength;
double lonLength;
double magnitude;
double percentage = 0;
double total_possible = 0;
double alpha = 0.5;
double Error_bound_1 = 1e-9;
double dfs_time = 0;




// namespace dataUsage{
using namespace std;
using namespace v8;


long double sim(Node a, Node b);
long double avgTextualSim(Node a, int index, vector<vector<int> >&QuerySet, string key);
bool checkDist(double R, int a, int b, string key);



double dist(double lat1, double lon1, double lat2, double lon2) {
    return Spherical_distance(lat1, lon1, lat2, lon2);
    //   return sqrt((lat1 - lat2)*(lat1 - lat2) + (lon1 - lon2)*(lon1 - lon2));
}
int getGridId(int nodeId,double minLat, double minLon, double maxLat, double maxLon, int cnt, string key) {
    int dcnt = cnt;
    double latLength = (maxLat - minLat + 1e-9) / dcnt;
    double lonLength = (maxLon - minLon + 1e-9) / dcnt;
    // int x = int((NodeSet[nodeId].latitude - minLat) / latLength);
    // int y = int((NodeSet[nodeId].longitude - minLon) / lonLength);
    int x = int((NodeMap[key][nodeId].latitude - minLat) / latLength);
    int y = int((NodeMap[key][nodeId].longitude - minLon) / lonLength);


    return x * dcnt + y;
}   

vector<double> getSpatialVector(vector<int> & y, string key) {
    vector<double> ans;
    int n = y.size();
    for (int i = 0; i < n - 1; i++)
        for (int j = i + 1; j < n; j++) {
            ans.push_back(
                    // dist(NodeSet[y[i]].latitude, NodeSet[y[i]].longitude,
                        //  NodeSet[y[j]].latitude, NodeSet[y[j]].longitude));
                    dist(NodeMap[key][y[i]].latitude, NodeMap[key][y[i]].longitude,
                         NodeMap[key][y[j]].latitude, NodeMap[key][y[j]].longitude));
        }
    return ans;
}

long double distanceRate(vector<vector<int> > &QuerySet, vector<int>& combination,
                         double Currentweight, string key) {
    vector<double> V1,V2;
    V1.clear();
    V2.clear();

    for (int i = 0;i < QuerySet.size(); i++) {
        V1 = getSpatialVector(QuerySet[i],key);
        V2 = getSpatialVector(combination,key);

        long double X = 0, Y = 0;
        for (int j = 0; j < V1.size(); j++) {
            X += (V1[j] * V1[j]);
            Y += (V2[j] * V2[j]);
        }
        X = sqrt(X);
        Y = sqrt(Y);
        return X/Y;
    }

}
long double GetSpatialSim(vector<int> & Query, vector<int>& combination, string key) {
    long double ans = 0;
    vector<double> V1;
    vector<double> V2;

    V1 = getSpatialVector(Query,key);
    V2 = getSpatialVector(combination,key);

    for (int i = 0; i < V1.size(); i++)
        ans += V1[i] * V2[i];

    long double X = 0, Y = 0;
    for (int i = 0; i < V1.size(); i++) {
        X += (V1[i] * V1[i]);
        Y += (V2[i] * V2[i]);
    }
    ans /= (sqrt(X) * sqrt(Y));

    return ans;
}

long double GetSpatialSim(int index, vector<int>& combination, string key) {
    long double ans = 0;
    vector<double> V2;

    V2 = getSpatialVector(combination,key);

    for (int i = 0; i < SpatialVector[index].size(); i++)
        ans += SpatialVector[index][i] * (V2[i]);

    long double X = 0, Y = 0;
    for (int i = 0; i < SpatialVector[index].size(); i++) {
        X += (SpatialVector[index][i] * SpatialVector[index][i]);
        Y += (V2[i] * V2[i]);
    }
    ans /= sqrt(Y);
    ans /= sqrt(X);

    return ans;
}


double GetAvgDist(vector<Node> &NodeSet, vector<int> &combination) {
    double ans = 0;
    int n = combination.size();
    for (int i = 0; i < n - 1; i++)
        for (int j = i + 1; j < n; j++)
            ans += dist(NodeSet[combination[i]].latitude,
                        NodeSet[combination[i]].longitude,
                        NodeSet[combination[j]].latitude,
                        NodeSet[combination[j]].longitude);

    return 2 * ans / (n * (n - 1));
}

long double sim(vector<vector<int> > &QuerySet, vector<int>& combination,
                double Currentweight, string key) {
    long double ans = 0;

    for (int i = 0; i < QuerySet.size(); i++) {
        ans += alpha * GetSpatialSim(i, combination, key);
    }
    return (1 - alpha) * Currentweight / QuerySet[0].size()
           + ans / QuerySet.size();

}



void dfs(vector<unordered_map<int,vector<PNode> > > &List, int num, vector<vector<int> > &querySet,
         vector<int> & combination, priority_queue<QueueNode> & que,
         double CurrentWeight,double totminLat, double totmaxLat, double totminLon, double totmaxLon,
         vector<double> & region_max_value, string key) {
    if (num == querySet[0].size()) {
        priority_queue<pair<double,vector<int> > > q;
        double sum = 0;
        set<vector<int> > ps;
        ps.clear();
        vector<int> sum_vec;
        sum_vec.clear();
        for (int i = 0;i < num; i++) {

            sum += List[i][combination[i]][0].weight;
            sum_vec.push_back(0);
        }
        q.push(make_pair(sum, sum_vec));

        for (int i = 0;i < K; i++) {

            if (q.empty()) break;
            pair<double,vector<int> > wc = q.top();
            q.pop();

            COUNT++;

            if (COUNT % 10000000 == 0) {
              ;
            }

            vector<int> candi_vector;
            candi_vector.clear();
            bool in_flag = false;
            for (int j = 0;j < num; j++) {
                candi_vector.push_back(List[j][combination[j]][wc.second[j]].id);
                if (j == 0) {
                    double lat1 = NodeMap[key][List[j][combination[j]][wc.second[j]].id].latitude;
                    double lon1 = NodeMap[key][List[j][combination[j]][wc.second[j]].id].longitude;
                    //  double lat1 = NodeSet[List[j][combination[j]][wc.second[j]].id].latitude;
                    // double lon1 = NodeSet[List[j][combination[j]][wc.second[j]].id].longitude;
                    if (lat1 >= totminLat && lat1 < totmaxLat && lon1 >= totminLon && lon1 < totmaxLon) {
                        in_flag = true;
                    }
                }
                if (j > 0 && List[j][combination[j]][wc.second[j]].id == 0) {

                }

            }
            double similarity = sim(querySet, candi_vector, wc.first, key);


            double rate = distanceRate(querySet, candi_vector, wc.first, key);



            if (que.size() >= K && ((1 - alpha) * wc.first / querySet[0].size() + alpha * 1.0) < que.top().weight + Error_bound_1)
                return;

            if ((rate > rate_p) || (rate < 1.0 / rate_p) || (! in_flag)) {
                if (rate > ((1 + rate_p) * rate_p)) {
                    return;
                }

                i -= 1;
            } else {

                if (que.size() < K) {
                    que.push(
                            QueueNode(candi_vector, similarity,
                                      GetAvgDist(NodeMap[key], candi_vector)));
                                    //   GetAvgDist(NodeSet, candi_vector)));

                } else if (similarity > que.top().weight) {
                    que.pop();
                    que.push(
                            QueueNode(candi_vector, similarity,
                                      GetAvgDist(NodeMap[key], candi_vector)));
                                    //   GetAvgDist(NodeSet, candi_vector)));


                }
            }
            int num1 = 0;
            if (! in_flag) {
                num1 = 1;
            } else  num1 = num;
            for (int j = 0; j < num1; j++) {
                if (wc.second[j] + 1 < List[j][combination[j]].size()) {
                    double sum_temp = wc.first - List[j][combination[j]][wc.second[j]].weight +
                                      List[j][combination[j]][wc.second[j] + 1].weight;
                    wc.second[j]++;
                    if (ps.find(wc.second) == ps.end()) {
                        q.push(make_pair(sum_temp, wc.second));
                        ps.insert(wc.second);
                    }
                    wc.second[j]--;
                }
            }

        }

        return;
    }

    int cSize = List.size();

    for (auto &gridId : List[num]) {
        combination[num] = gridId.first;

        if (que.size() >= K) {
            double UB = 0;
            double cw = 0;
            for (int j = 0;j <= num; j++) {
                cw += List[j][combination[j]][0].weight;
            }
            for (int j = num+1; j < querySet[0].size(); j++) {
                cw += region_max_value[j];
            }
            UB = (1-alpha) * cw / querySet[0].size() + alpha * 1.0;
            if (UB < min(Error_bound_1 + que.top().weight,1.0)) {

                continue;
            }
        }

        dfs(List, num + 1, querySet, combination, que,
            CurrentWeight + 0,totminLat, totmaxLat, totminLon, totmaxLon, region_max_value, key);
    }
}


 bool checkDist(double R, int a, int b, string key) {
    return Spherical_distance(NodeMap[key][a].latitude, NodeMap[key][a].longitude,
                              NodeMap[key][b].latitude, NodeMap[key][b].longitude) <= R;
    // return Spherical_distance(NodeSet[a].latitude, NodeSet[a].longitude,
    //                           NodeSet[b].latitude, NodeSet[a].longitude) <= R;
}

 void BuildIndex(string key) {
    int num = 0;
    // int n = NodeSet.size();
    int n = NodeMap[key].size();
    for (int i = 0; i < n; i++) {
        for (string e : NodeMap[key][i].categories) {
            // cout << e << endl;
            if (InvertedMap[key].find(e) != InvertedMap[key].end()) {
                InvertedMap[key][e].insert(i);
            } else {
                set<int> s;
                s.insert(i);
                InvertedMap[key].insert(pair<string, set<int> >(e, s));
            }
        }
    }
    // for (int i = 0; i < n; i++) {
    //     for (string e : NodeSet[i].categories) {
    //         if (InvertedList.find(e) != InvertedList.end()) {
    //             num++;
    //             InvertedList[e].insert(i);
    //         } else {
    //             set<int> s;
    //             s.insert(i);
    //             InvertedList.insert(pair<string, set<int> >(e, s));
    //         }
    //     }
    // }
}

extern long double avgTextualSim(Node a, int index, vector<vector<int> >&QuerySet, string key) {
    int n = QuerySet.size();
    long double ans = 0;
    for (int i = 0; i < n; i++) {
        // long double x = sim(a, NodeSet[QuerySet[i][index]]);
        long double x = sim(a, NodeMap[key][QuerySet[i][index]]);


        ans += x;
    }

    return ans / n;
}

long double sim(Node a, Node b) {
    long double ans = 0;
    double fenzi = 0;
    double fenmu_1 = 0;
    double fenmu_2 = 0;
    for (int i = 0;i < 3; i++) {
        fenzi += a.type_arr[i] * b.type_arr[i];
        fenmu_1 += a.type_arr[i] * a.type_arr[i];
        fenmu_2 += b.type_arr[i] * b.type_arr[i];
    }

    if (fenmu_1 == 0 || fenmu_2 == 0)
        return 0;

    return fenzi / (sqrt(fenmu_1) * sqrt(fenmu_2));

}

void splitDFS(vector<Node> &NodeSet, vector< vector<PNode> > &NodeListSet, vector<vector<int> > &querySet, double length_limit, int D, int odd, vector<int> & combination, priority_queue<QueueNode> & que, long long a1, long long a2,
              double totminLat, double totmaxLat, double totminLon, double totmaxLon, string key) {

    double newminLat = 1e18;
    double newminLon = 1e18;
    double newmaxLat = -1e18;
    double newmaxLon = -1e18;

    double minLatList[10];
    double minLonList[10];
    double maxLatList[10];
    double maxLonList[10];

    int minmaxI = 0;
    for (auto nodeList:NodeListSet) {
        minLatList[minmaxI] = 1e18;
        minLonList[minmaxI] = 1e18;
        maxLatList[minmaxI] = -1e18;
        maxLonList[minmaxI] = -1e18;
        for (auto p:nodeList) {
            newminLat = min(newminLat, NodeSet[p.id].latitude);
            newminLon = min(newminLon, NodeSet[p.id].longitude);
            newmaxLat = max(newmaxLat, NodeSet[p.id].latitude);
            newmaxLon = max(newmaxLon, NodeSet[p.id].longitude);
            minLatList[minmaxI] = min(minLatList[minmaxI], NodeSet[p.id].latitude);
            minLonList[minmaxI] = min(minLonList[minmaxI], NodeSet[p.id].longitude);
            maxLatList[minmaxI] = max(maxLatList[minmaxI], NodeSet[p.id].latitude);
            maxLonList[minmaxI] = max(maxLonList[minmaxI], NodeSet[p.id].longitude);
        }
        minmaxI += 1;
    }
    double midLat = (totminLat + totmaxLat) / 2.0;
    double midLon = (totminLon + totmaxLon) / 2.0;
    double distRan1 = dist(midLat, midLon, midLat, totmaxLon);
    double distRan2 = dist(midLat, midLon, totmaxLat, midLon);


    // cout << "splitdfs if1" << endl;

    if ((distRan1 <= length_limit * rate_p + Error_bound_1) || (distRan2 <= length_limit * rate_p + Error_bound_1)) {
        vector< unordered_map<int,vector<PNode> > > gridList;
        gridList.clear();
        gridList.resize(querySet[0].size());
        double totdis = dist(newminLat,newminLon, newmaxLat, newmaxLon);

        double rr = min(2.0,(2*sqrt(3)* rate_p * totdis / D / length_limit + 1));

        int type_cnt = 0;
        vector<double> region_max_value;
        region_max_value.clear();
        for (auto nodeList: NodeListSet) {
            double max_att_val = 0;
            for (auto p:nodeList) {
                int gridId = getGridId(p.id, minLatList[type_cnt], minLonList[type_cnt], maxLatList[type_cnt], maxLonList[type_cnt], D, key);
                if (gridList[type_cnt].find(gridId) == gridList[type_cnt].end()) {
                    gridList[type_cnt][gridId].clear();
                }
                if (gridList[type_cnt][gridId].size() < K * rr) {
                    gridList[type_cnt][gridId].push_back(p);
                }
                max_att_val = max(max_att_val, p.weight);
            }
            type_cnt += 1;
            region_max_value.push_back(max_att_val);

        }

        clock_t s_dfs = clock();
        dfs(gridList, 0, querySet, combination, que, 0, totminLat, totmaxLat, totminLon, totmaxLon, region_max_value, key);
        clock_t e_dfs = clock();
        dfs_time += (e_dfs - s_dfs ) /  (double) CLOCKS_PER_SEC;

    }
    else {
        vector<vector<PNode> > leftListSet;
        vector<vector<PNode> > rightListSet;
        leftListSet.clear();
        rightListSet.clear();

        bool leftFlag = true;
        bool rightFlag = true;
        for (auto pList:NodeListSet) {
            vector<PNode> leftList;
            vector<PNode> rightList;
            leftList.clear();
            rightList.clear();
            for (auto p:pList) {
                if (odd % 2 == 0) {
                    double dis1 = dist(midLat, NodeSet[p.id].longitude, NodeSet[p.id].latitude, NodeSet[p.id].longitude) ;


                    if ((NodeSet[p.id].latitude < midLat) || (dis1 < length_limit * rate_p)) {
                        leftList.push_back(p);
                    }

                    if ((NodeSet[p.id].latitude >= midLat) || (dis1 < length_limit * rate_p)) {
                        rightList.push_back(p);
                    }

                } else {

                    double dis1 = dist(NodeSet[p.id].latitude, midLon, NodeSet[p.id].latitude, NodeSet[p.id].longitude) ;


                    if ((NodeSet[p.id].longitude < midLon) || (dis1 < length_limit * rate_p)) {
                        leftList.push_back(p);
                    }

                    if ((NodeSet[p.id].longitude >= midLon) || (dis1 < length_limit * rate_p)) {
                        rightList.push_back(p);
                    }
                }
            }

            if (leftList.size() == 0) {
                leftFlag = false;
            }
            if (rightList.size() == 0){
                rightFlag = false;
            }
            leftListSet.push_back(leftList);
            rightListSet.push_back(rightList);
        }

        if (leftFlag) {
            if (odd % 2 == 0) {
                splitDFS(NodeSet, leftListSet, querySet, length_limit, D, (odd + 1), combination, que, a1 * 2 + 0,
                         a2 * 2, totminLat, midLat, totminLon, totmaxLon, key);
            } else {
                splitDFS(NodeSet, leftListSet, querySet, length_limit, D, (odd + 1), combination, que, a1 * 2 + 0,
                         a2 * 2, totminLat, totmaxLat, totminLon, midLon, key);
            }
        }
        if (rightFlag) {
            if (odd % 2 == 0) {
                splitDFS(NodeSet, rightListSet, querySet, length_limit, D, (odd + 1), combination, que, a1 * 2 + 1,
                         a2 * 2, midLat, totmaxLat, totminLon, totmaxLon, key);
            } else {
                splitDFS(NodeSet, rightListSet, querySet, length_limit, D, (odd + 1), combination, que, a1 * 2 + 1,
                         a2 * 2, totminLat, totmaxLat, midLon, totmaxLon, key);
            }
        }
    }
}


long double GetTextualSim(vector<int> & Query, vector<int>& combination, string key) {
    long double ans = 0;
    int n = Query.size();

    for (int i = 0; i < n; i++) {
        // ans += sim(NodeSet[Query[i]], NodeSet[combination[i]]);
        ans += sim(NodeMap[key][Query[i]], NodeMap[key][combination[i]]);
    }

    return ans / n;
}


 vector<PNode> FilterType(vector<Node> &nodeset, int id, int index,
                         vector<vector<int> > &querySet, double r, string key) {
    vector<PNode> ans;

    int count = 0;
    int count2 = 0;
    //for (int i = 0; i < nodeset.size(); i++) {
    //   if (i == id) continue;
    //bool used[nodeset.size() + 1];
    // cout << "Before " << endl;
    // bool* used  = new bool[ nodeset.size() + 1];
    // memset(used, 0, sizeof(used));
     vector<bool> used(nodeset.size()+1);
    for (auto e : nodeset[id].categories) {
        for (auto item : InvertedMap[key][e]) {
            if (used[item] || checkDist(r, id, item, key) == false){
                count2++;
                continue;
            }
            ans.push_back(
                    PNode(item, avgTextualSim(nodeset[item], index, querySet, key),
                          dist(NodeMap[key][id].latitude, NodeMap[key][id].longitude,
                               NodeMap[key][item].latitude,
                               NodeMap[key][item].longitude)));
            used[item] = 1;
            count++;
        }
    }
    // for (auto e : nodeset[id].categories) {
    //     for (auto item : InvertedList[e]) {
    //         if (used[item] || checkDist(r, id, item) == false){
    //             count ++;
    //             continue;
    //         }
    //         ans.push_back(
    //                 PNode(item, avgTextualSim(nodeset[item], index, querySet),
    //                       dist(NodeSet[id].latitude, NodeSet[id].longitude,
    //                            NodeSet[item].latitude,
    //                            NodeSet[item].longitude)));
    //         used[item] = 1;
    //             // cout << "update? " << used[item] << "/" << used.at(item) << endl;
    //         //count++;
    //         //if (count > 100) return ans;
    //     }
    // }
    return ans;
}


vector<QueueNode> getTopK(vector<Node> &NodeSet, vector<vector<int> > &querySet,
                          double r,int D, int K, string key) {
    priority_queue<QueueNode> que;
    priority_queue<QueueNode> UPque;
    vector<vector<PNode> > oriList;
    vector<vector<PNode> > oriListSpatial;
    vector<vector<PNode> > List[50];
    vector<vector<PNode> > upList[50];
    vector<vector<PNode> > ListSpatial[50];
    vector<vector<PNode> > upListSpatial[50];
    vector<vector<int> > changedQuerySet;

    long long possible = 1;
    double data_ratio = 1;
    // cout <<"data r "<< r<<endl;
    // cout <<"in Top K, before loop "<<endl;

    for (int i = 0; i < querySet[0].size(); i++) {
        // for (auto e:NodeSet[querySet[0][i]].categories)
            // cout<<"query e: "<<e<<endl;
        // cout<<"query e finished"<<endl;
        vector<PNode> pNodeList = FilterType(NodeSet, querySet[0][i], i,
                                             querySet, r, key);
        // cout<<"PNodeList FilterType finished!"<<endl;

        vector<PNode> pNodeListSpatial(pNodeList.begin(), pNodeList.end());
        if (!BASELINE) {
            sort(pNodeListSpatial.begin(), pNodeListSpatial.end(), comp2);
            sort(pNodeList.begin(), pNodeList.end(), comp);
        }
        // cout <<"PNodeList size: "<<pNodeList.size()<<endl;
        oriList.push_back(pNodeList);
        oriListSpatial.push_back(pNodeListSpatial);
        possible *= pNodeList.size();
    }

    // cout<<"alpha "<< alpha<<endl;
    // cout<< "possible "<< possible<<endl;
    total_possible += possible;


    for (int i = 0; i < 10; i++)
        numMapping[i] = i;
    int ListSizes[10];
    for (int i = 0; i < oriList.size(); i++) {
        ListSizes[i] = oriList[i].size();
        // cout << ListSizes[i] << " ";
    }
    // cout << endl;

    for (int i = 0;i < oriList.size(); i++) {
        // cout << ListSizes[i] << " ";
    }
    // cout<<endl;

    int oriListSize = oriList.size();

    double wz = 0;


    minLat.clear();
    minLon.clear();
    maxLat.clear();
    maxLon.clear();
    double totminLat = 1e18;
    double totminLon = 1e18;
    double totmaxLat = -1e18;
    double totmaxLon = -1e18;

    for (int i = 0;i < oriListSize; i++) {
        int oriListItemSize = oriList[i].size();
        minLat.push_back(1e18);
        minLon.push_back(1e18);
        maxLat.push_back(-1e18);
        maxLon.push_back(-1e18);
        wz += 1.0 / oriListItemSize;

        for (int j = 0; j < oriList[numMapping[i]].size(); j++) {
            minLat[i] = min(minLat[i], NodeSet[oriList[numMapping[i]][j].id].latitude);
            minLon[i] = min(minLon[i], NodeSet[oriList[numMapping[i]][j].id].longitude);
            maxLat[i] = max(maxLat[i], NodeSet[oriList[numMapping[i]][j].id].latitude);
            maxLon[i] = max(maxLon[i], NodeSet[oriList[numMapping[i]][j].id].longitude);
        }

        totminLat = min(totminLat, minLat[i]);
        totminLon = min(totminLon, minLon[i]);
        totmaxLat = max(totmaxLat, maxLat[i]);
        totmaxLon = max(totmaxLon, maxLon[i]);

    }

    double minmaxLat;
    double minmaxLon;

    for (int i = 0;i < oriListSize; i++) {

        minmaxLat = Spherical_distance(minLat[i],minLon[i],maxLat[i],minLon[i]);
        minmaxLon = Spherical_distance(minLat[i],minLon[i],minLat[i],maxLon[i]);

        // cout<<i<<" minmaxLat: "<<minmaxLat<<" minmaxLon: "<<minmaxLon<<endl;

    }

    minmaxLat = Spherical_distance(totminLat,totminLon,totmaxLat,totminLon);
    minmaxLon = Spherical_distance(totminLat,totminLon,totminLat,totmaxLon);
    // cout<<" minmaxLat: "<<minmaxLat<<" minmaxLon: "<<minmaxLon<<endl;

    LatSplitNum = int(minmaxLat/100);
    LonSplitNum = int(minmaxLon/100);
    latLength = (totmaxLat - totminLat) / LatSplitNum;
    lonLength = (totmaxLon - totminLon) / LonSplitNum;





    extern double CostInPreSort;

    long start = clock();



    for (int i = 0; i < querySet.size(); i++) {
        vector<int> temp;
        temp.resize(oriListSize);
        for (int j = 0; j < oriListSize; j++) {
            temp[j] = querySet[i][numMapping[j]];
            //  temp[j] = querySet[i][j];
        }
        changedQuerySet.push_back(temp);
    }

    SpatialVector.clear();
    for (int i = 0; i < changedQuerySet.size(); i++) {
        int mag_sum = 0;
        for (int j = 0; j < changedQuerySet[i].size(); j++)
            mag_sum += changedQuerySet[i][j];
        mag_sum /= changedQuerySet[0].size();
        magnitude = mag_sum;
        SpatialVector.push_back(getSpatialVector(changedQuerySet[i],key));
    }
//	cout << possible << endl;
    COUNT = 0;
    // cout <<"Count: "<<COUNT<<endl;
    // cout << "before getSpatial" << endl;
    vector<int> combination(oriListSize);
    while (!que.empty()) {
        que.pop();
    }
    //dfs(List[0], 0, changedQuerySet, combination, que, 0);
    vector<double>  spatial_query_vec = getSpatialVector(changedQuerySet[0],key);
    double length_limit = 0;
    for (auto wi : spatial_query_vec) {
        length_limit += wi * wi;
    }
    length_limit = sqrt(length_limit);
    // cout << "before splitdfs1" << endl;
    // splitDFS(NodeMap[key], oriList, changedQuerySet, length_limit, D, 0,  combination, que, 0, 1, totminLat, totmaxLat+1e-8, totminLon, totmaxLon+1e-8, key);
    splitDFS(NodeSet, oriList, changedQuerySet, length_limit, D, 0,  combination, que, 0, 1, totminLat, totmaxLat+1e-8, totminLon, totmaxLon+1e-8, key);
    
    //dfs(gridListDict[D], 0, changedQuerySet, combination, que, 0);
    // cout <<"Count: "<<COUNT<<" D: "<<D<<endl;


    int kcnt = 2;

    double UPbound = 1.0;



    // cout<<"main dfs finished!"<<endl;

    vector<QueueNode> ans;
    while (!que.empty()) {
        ans.push_back(que.top());
        que.pop();
    }
    reverse(ans.begin(), ans.end());

//	cout << "count " << COUNT << endl << endl;
//
    percentage += (possible - COUNT) * 1.0 / possible;
    // cout << "percentage: "<<(possible - COUNT) * 1.0 / possible<<endl;

    return ans;
}

void printInverted(){
    for(auto pair : InvertedList ){
        cout << pair.first << " - {";
        for (auto it = pair.second.begin(); it !=
                             pair.second.end(); ++it)
            cout << ',' << *it;
        cout << "}" << endl;
    }
}

vector<string> run(string key){
    // InvertedMap[key].clear();
    BuildIndex(key);
    // InvertedList.clear();
    // BuildIndex();
    vector<string> ret_data;
    string points, rates;
    // printInverted();
    // return "";
    //Rset = NodeSet.size();
    // cout << "before result" <<  << endl;
    vector<QueueNode> ans = getTopK(NodeMap[key], QueryMap[key][0], Rset, D, K, key);
    // vector<QueueNode> ans = getTopK(NodeSet, QuerySet[0], Rset, D, K);
    // cout << "before loop" << endl;
      cout << "ans size " << ans.size() << endl;
    for (int i = 1; i < ans.size(); i++) {
                    // cout<< "Rate: "<<distanceRate(QuerySet[0],ans[i].id,0)<<endl;
                    // cout<<"Spatial sim: "<<GetSpatialSim(QuerySet[0][0],ans[i].id)<<endl;
                    // cout << "Text sim: "<<GetTextualSim(QuerySet[0][0],ans[i].id)<<endl;
                    // printf ("Sim=%.9lf\t",ans[i].weight);
                    for (int j = 0; j < ans[i].id.size(); j++) {
                        // points.append(NodeSet[ans[i].id[j]].name  +  ",," + to_string(NodeSet[ans[i].id[j]].latitude) + ",,"+ to_string(NodeSet[ans[i].id[j]].longitude) );
                        points.append(NodeMap[key][ans[i].id[j]].name  +  ",," + to_string(NodeMap[key][ans[i].id[j]].latitude) + ",,"+ to_string(NodeMap[key][ans[i].id[j]].longitude) );
                        if(j != ans[i].id.size()-1)
                            points.append("/");
                        
                        // cout << ans[i].id[j] << "(" << NodeMap[key][ans[i].id[j]].name << ")\t";
                    }
                    // rates.append(to_string(distanceRate( QuerySet[0],ans[i].id,0))  + ",,"  + to_string(GetSpatialSim( QuerySet[0][0],ans[i].id)));
                    rates.append(to_string(distanceRate(QueryMap[key][0],ans[i].id,0, key))  + ",,"  + to_string(GetSpatialSim(QueryMap[key][0][0],ans[i].id, key)));
                    if( i != ans.size()-1){
                        points.append("*");
                        rates.append("*");
                    }
                    // cout<<endl;
                    // cout<<"dis: ";
                    for (int j = 0; j< ans[i].id.size(); j++) {
                        for (int j1 = j+1;j1 < ans[i].id.size(); j1++) {
                            double dis = dist(NodeMap[key][ans[i].id[j]].latitude, NodeMap[key][ans[i].id[j]].longitude,
                                              NodeMap[key][ans[i].id[j1]].latitude, NodeMap[key][ans[i].id[j1]].longitude);
                            // double dis = dist(NodeSet[ans[i].id[j]].latitude,NodeSet[ans[i].id[j]].longitude,
                            //                   NodeSet[ans[i].id[j1]].latitude, NodeSet[ans[i].id[j1]].longitude);
                            // cout << dis << " ";
                        }
                    }
                    // cout << endl;
                }
                // cout << "END" << endl;
    // cout << "after loop" << endl;
    ret_data.push_back(points);
    ret_data.push_back(rates);
    return ret_data;
}

// }


struct compare{
    string key;
    compare(string const &i): key(i){}

    bool operator()(string const &i){
        return(i.compare(key) == 0);
    }
};

// namespace dataRetrieval{

// using namespace std;
// using namespace dataUsage;
// using namespace v8;

void readData(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();
       Node node;
//   vector<string> type_list;
  vector<int> type_arr;
  // name, lat, lng, types, attributes
  double arg_id = args[0].As<Number>()->Value();
  String::Utf8Value arg_name(isolate, args[1]);
  double arg_lat = args[2].As<Number>()->Value();
  double arg_lng = args[3].As<Number>()->Value();
  String::Utf8Value arg_types(isolate, args[4]);
  String::Utf8Value arg_arr(isolate, args[5]);
  string cpp_name(*arg_name);
  string cpp_types(*arg_types);
  string cpp_arr(*arg_arr);
  String::Utf8Value key(isolate, args[6]);
  string cpp_key(*key);
  // convert string to list
  size_t pos = 0;
  string token;
  string delimiter = ",";
//   while ((pos = cpp_types.find(delimiter)) != std::string::npos) {
//     token = cpp_types.substr(0, pos);
//     type_list.push_back(token);
//     cpp_types.erase(0, pos + delimiter.length());
//   }
//   if(cpp_types.size() != 0)
//     type_list.push_back(cpp_types);
    // cout << arg_id << endl;
  while ((pos = cpp_arr.find(delimiter)) != std::string::npos) {
    token = cpp_arr.substr(0, pos);
    type_arr.push_back(stoi(token));
    cpp_arr.erase(0, pos + delimiter.length());
  }
  if(cpp_arr.size() != 0)
    type_arr.push_back(stoi(cpp_arr));
  
  node.business_id = arg_id;
  node.name = cpp_name;
  node.latitude = arg_lat;
  node.longitude = arg_lng;
  node.categories.insert(cpp_types);
  node.review_count = 1;
  node.stars = 1;
  for(int r = 0; r < 20; r ++){
      if(r < type_arr.size())
        node.type_arr[r] = type_arr[r];
      else
        node.type_arr[r] = 0;

  }
  if(std::find_if(LocationMap[cpp_key].begin(), LocationMap[cpp_key].end(), compare(cpp_name)) == LocationMap[cpp_key].end() ){
    NodeMap[cpp_key].push_back(node);
    LocationMap[cpp_key].push_back(cpp_name);
  }
//   if(std::find_if(LocationSet.begin(),LocationSet.end(), compare(cpp_name)) ==LocationSet.end() ){
//     NodeSet.push_back(node);
//     LocationSet.push_back(cpp_name);
//   }
 
}

void readQuery(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();
  vector<vector<int> > QuerySetZ;
  vector<int> example;
  String::Utf8Value arg_id_list(isolate, args[0]);
  String::Utf8Value key(isolate, args[1]);
  string cpp_key(*key);
  string cpp_id_list(*arg_id_list);
  size_t pos = 0;
  string token;
  string delimiter = ",";
  while ((pos = cpp_id_list.find(delimiter)) != std::string::npos) {
    token = cpp_id_list.substr(0, pos);
    example.push_back(stoi(token));
    cpp_id_list.erase(0, pos + delimiter.length());
  }
  if(cpp_id_list.size() != 0)
    example.push_back(stoi(cpp_id_list));

  QuerySetZ.push_back(example);  
//   QuerySet.push_back(QuerySetZ);
  QueryMap[cpp_key].push_back(QuerySetZ);
}

void runLORA(const FunctionCallbackInfo<Value>& args){
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();
  K = args[0].As<Number>()->Value() + 1;
  String::Utf8Value key(isolate, args[1]);
  string cpp_key(*key);
  vector<string> results = run(cpp_key);
  string finalre = results.at(0) + "**" +  results.at(1);
//   cout << finalre << endl;
  args.GetReturnValue().Set(
        String::NewFromUtf8(isolate,finalre.c_str()).ToLocalChecked());
}

void cleanNodeData(const FunctionCallbackInfo<Value>& args){
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();
  String::Utf8Value key(isolate, args[0]);
  string cpp_key(*key);
  NodeMap[cpp_key].clear();
  QueryMap[cpp_key].clear();
  LocationMap[cpp_key].clear();
  InvertedMap[cpp_key].clear();
//   QuerySet.clear();
//   NodeSet.clear();
//   InvertedList.clear();
//   LocationSet.clear();

}

void checkData(const FunctionCallbackInfo<Value>& args){
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();
    int empty = 0;
    if(QuerySet.size() == 0)
        empty = 1;

    args.GetReturnValue().Set(String::NewFromUtf8(isolate,to_string(empty).c_str()).ToLocalChecked());
    
    
}

void createPair(const FunctionCallbackInfo<Value>& args){
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();
  String::Utf8Value key(isolate, args[0]);
  string cpp_key(*key);
  if(NodeMap.find(cpp_key) == NodeMap.end()){
    NodeMap.insert(pair<string,vector<Node>> (cpp_key, NodeSet));
    LocationMap.insert(pair<string,vector<string>> (cpp_key, LocationSet));
    QueryMap.insert(pair<string, vector<vector<vector<int>>>> (cpp_key, QuerySet));
    InvertedMap.insert(pair<string, map<string, set<int>>> (cpp_key, InvertedList));
    cout << "Add "<< NodeMap.size() << endl;

  }
}

void deletePair(const FunctionCallbackInfo<Value>& args){
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();
  String::Utf8Value key(isolate, args[0]);
  string cpp_key(*key);
  NodeMap.erase(cpp_key);
  LocationMap.erase(cpp_key);
  QueryMap.erase(cpp_key);
  InvertedMap.erase(cpp_key);
  cout << "Delete "<< NodeMap.size() << endl;
}

// void check(const FunctionCallbackInfo<Value>& args){
//   Isolate* isolate = args.GetIsolate();
//   Local<Context> context = isolate->GetCurrentContext();
//   String::Utf8Value key(isolate, args[0]);
//   string cpp_key(*key);
//   if(std::find_if(keySet.begin(),keySet.end(), compare(cpp_key)) ==keySet.end() ){
//     cout << "Created "<< cpp_key << endl;
//   }
// }

// void printKeySet(const FunctionCallbackInfo<Value>& args){
//   Isolate* isolate = args.GetIsolate();
//   Local<Context> context = isolate->GetCurrentContext();
//   for(int i = 0; i < keySet.size(); i++){
//     cout << i << " => "<< keySet.at(i) << endl;

//   }
// }

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(exports, "readDatabase" , readData);
  NODE_SET_METHOD(exports, "readQuery" , readQuery);
  NODE_SET_METHOD(exports, "runLORA" , runLORA);
  NODE_SET_METHOD(exports, "reset", cleanNodeData);
//   NODE_SET_METHOD(exports, "check", check);
//   NODE_SET_METHOD(exports, "print", printKeySet);
  NODE_SET_METHOD(exports, "createPair", createPair);
  NODE_SET_METHOD(exports, "deletePair", deletePair);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

// }


