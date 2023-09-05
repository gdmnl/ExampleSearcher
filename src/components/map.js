import React, {useState, useEffect} from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle, Polygon  } from '@react-google-maps/api';
import { Button, colors} from '@mui/material';
import { AddMapMarkerContext } from '../context/addMapMarker';
import { AddLocationTwoContext } from '../context/addLocationTwo';
import { MapControlContext } from '../context/mapControl';
import axios from 'axios'
import {nanoid} from 'nanoid';


const containerStyle = {
  position: "relative",
  width: "100%",
  height: "100%"
}

const iconColor = [
  colors.amber,
  colors.blue,
  colors.blueGrey,
  colors.brown,
  colors.deepPurple,
  colors.green,
  colors.indigo,
  colors.lightGreen,
  colors.lime,
  colors.pink,
  colors.cyan,
  colors.teal,
  colors.lightBlue,
  colors.grey,
  colors.deepOrange
];

const optionsCircle = {
  strokeColor: '#000000',
  strokeOpacity: 0.8,
  strokeWeight: 1,
  fillColor: '#0000FF',
  fillOpacity: 0.15
}

const libraries =  ["places"];

function MapComponent(){
    const [resultLocations, setResultLoc] = useState(null);
    const [resultWindow, setResultWindow] = useState({list: []});
    const [resultPolyline, setResultPoly] = useState(null);
    const [colorList, setColorList] = useState(null);
    const [center, setCenter] = useState(null);
    const [centerMarker, setCenterMarker] = useState(null);
    const [zoom, setZoom] = useState(null);
    const [markerList, setMarkerList] = useState({list:[]});
    const [markLocalList, setMarkerLocalList] = useState({list:[]});
    const [circleVisible, setCircleVisible] = useState(true);
    const [resultList, setResultList] = useState({list:[]});
    const [searchRad, setSearchRad] = useState(1);
    const [centerRadius, setCenterRadius] = useState(1000);
    const [morePage, setMorePage] = useState(false);
    const [runLORAFlag, setRunLORAFlag] = useState([false]);
    const [isLoading, setLoading] = useState(true);
    const [map, setMap] = React.useState(null);
    const [polyVis, setPolyVis] = useState(0);

    function initial(){
      if(colorList === null)
        setColorList([]);
      if(centerMarker === null)
        setCenterMarker(center);
      if(zoom === null)
        setZoom(15);
      if(resultLocations === null)
        setResultLoc({list: []});
      if(resultPolyline === null)
        setResultPoly({list: []});
      if(center === null){
        sessionStorage.setItem("SSbE_event", "")
        sessionStorage.setItem("SSbE_sort", "default");
        sessionStorage.setItem("SSbE_textTab", JSON.stringify(false));
        sessionStorage.setItem("SSbE_markTab", JSON.stringify(false));
        sessionStorage.setItem("SSbE_resultTab", JSON.stringify(false));
        sessionStorage.setItem("SSbE_settingTab", JSON.stringify(false));
        sessionStorage.setItem("SSbE_result", JSON.stringify([]))
        sessionStorage.setItem("SSbE_searchType", JSON.stringify([]))
        sessionStorage.setItem("SSbE_mark", JSON.stringify([]))
        sessionStorage.setItem("SSbE_text", JSON.stringify([]))
        sessionStorage.setItem("SSbE_query", JSON.stringify([]))
        sessionStorage.setItem("SSbE_K", 5);
        sessionStorage.setItem("SSbE_searchRad", 1);
        sessionStorage.setItem("SSbE_morePage", "false");
        sessionStorage.setItem("SSbE_event", -1);
        sessionStorage.setItem("SSbE_runData", JSON.stringify([]));
        const checkKey = sessionStorage.getItem("SSbE_key");
        console.log(checkKey)
        if(checkKey === "" | checkKey === null){
          const ID = nanoid(8) + String(new Date().getTime());
          sessionStorage.setItem("SSbE_key", String(ID));
          axios.post('http://localhost:5000/generateKey', {key: ID}).then(res=>{
            if(res.data.success === true){
              console.log(res.data.message);
            }
          }).catch(function (error){console.log(error);});
        }
        setCenter({
          lat:1.290270,
          lng:103.851959
        });
        
        window.addEventListener("beforeunload",()=>{
          const key = sessionStorage.getItem("SSbE_key");
          sessionStorage.setItem("SSbE_key", "");
          axios.post('http://localhost:5000/deleteKey', {key: key}).then(res=>{
            if(res.data.success === true){
              console.log(res.data.message)
            }
          }).catch(function (error){console.log(error);});
        })
      }
    }
    function handleCircle(){
      setCircleVisible(!circleVisible);
    }
    function handleSort(){
      const sort = sessionStorage.getItem("SSbE_sort");
      const polygonList = resultPolyline.list;
      const results = sessionStorage.getItem("SSbE_result");
      const responseR = JSON.parse(results);
      polygonList.sort(function(a, b){
        if(sort === "dist")
          return Number(a.dist) - Number(b.dist);
        else if(sort === "spatial")
          return Number(a.spatial) - Number(b.spatial);
        else
          return Number(a.id) - Number(b.id);
    } )
      for(let x = 0; x < polygonList.length; x++){
        if(x === Number(polyVis))
          polygonList[x].visible = true;
        else
          polygonList[x].visible = false;
      }
    
      setResultPoly({list:polygonList})
      setResultList({list:responseR});

    }
    function handlePolygon(newv, oldv){
      const polygonList = resultPolyline.list;
      polygonList[newv-1].visible = true;
      polygonList[oldv-1].visible = false;
      setPolyVis(newv-1);
      setResultPoly({list:polygonList});
    }

    const { isLoaded,loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "",
        libraries:libraries,

      })
    

      const options = {
        fullscreenControl:false,
        streetViewControl:false,
        minZoom:2,
        maxZoom:25,
        defaultZoom:12,
        mapTypeControl:false,
      }

      function handleDrag(e){
        const nCenter = {lat: e.latLng.lat(), lng: e.latLng.lng()};
        setCenterMarker(nCenter);  
        
      }
     
      const onLoad = React.useCallback(function callback(map) {
        setMap(map);
      }, [])

      const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
      }, [])

      function onZoomChanged() {
        if(map !== null){
          const x = map.getZoom();
          setZoom(x);
        }
      }

      function onCenterChanged(){
        if(map !== null){
          const y = map.getCenter();
          setCenter(y);
        
       }
      }
      function setColorListName(name){
        var index = colorList.findIndex(x => x === name);
        if(index === -1){
          colorList.push(name);
          console.log(colorList)
        }
        
      }
      function handleInfoWindow(id){
        const infoList = resultWindow.list;
        const index = infoList.findIndex(x => x.p === id);
        console.log(infoList, id, index)
        infoList[index].visible = ! infoList[index].visible;
        setResultWindow({list:infoList});
      }
      function handleSearchRad(val){
        const newNum = Number(val);
        setSearchRad(newNum);
        setCenterRadius(newNum*1000);
        console.log(centerRadius)
      }
      function handleNumOfPage(val){
        console.log(val)
        setMorePage(val);
      }

      function jumpLocation(location){
          const request = {
            query: location 
          } 
          const service =  new window.google.maps.places.PlacesService(map);
          service.textSearch(request,   (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                const newCent = {
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng()
                }
                setCenterMarker(newCent);
                map.setCenter(newCent);
                map.setZoom(12);
              }
          });
      }

      function runLORA(){
        const key = sessionStorage.getItem("SSbE_key");
            const data = sessionStorage.getItem("SSbE_query");
            const query = JSON.parse(data);
            const K = sessionStorage.getItem("SSbE_K")
            const val = sessionStorage.getItem("SSbE_runData")
            const valList = JSON.parse(val);
            axios.post('http://localhost:5000/runLORA', {query: query, K: K, datalist: valList, key: key}).then(res=>{
              if(res.data.success === true){
                var locationList = [];
                var polyList = [];
                var legendList = [];
                const retResult = [];
                var infoList = [];
                for(let k = 0; k < res.data.results.length; k ++){
                  var path = [];
                  var first;
                  var data = res.data.results[k].toString();
                  var dataList = data.split('/');
                  var nameList = [];
                  var resultNames = "";
                  var spatialRate, distRate;
                  var nameR = "", coord;
                  for(let j = 0; j < dataList.length; j++){
                    var point = dataList[j].toString();
                    var pointList = point.split(',,');
                    nameR = pointList[0];
                    var key = pointList[1] + "," + pointList[2];
                    coord = {lat: Number(pointList[1]), lng: Number(pointList[2])};
                    if(j === 0){
                      first = coord;
                    }
                    path.push(coord)
                    nameList.push(nameR);
                    if(locationList.findIndex(x => x.name === nameR) === -1){
                      locationList.push({p: key, name: nameR, color: j,coord:coord});
                      infoList.push({p: key, name:nameR, visible:true,coord:coord} );
                    }
                    resultNames = resultNames + pointList[0];
                    if(j !== dataList.length-1)
                      resultNames = resultNames + "/^/";
                  }
                  path.push(first);
                  legendList.push(nameList);
                  
                  var rates = res.data.result_rate[k].split(",,");
                  distRate = Number(rates[0])*100;
                  spatialRate = Number(rates[1])*100;
                  if(k === 0){
                    polyList.push({id: k, paths:path, visible:true, dist:distRate, spatial:spatialRate});
                  }
                  else{
                    polyList.push({id: k, paths:path, visible:false, dist:distRate, spatial:spatialRate});
                  }
                  
                  retResult.push({id: k, travList: resultNames, dist:distRate, spatial:spatialRate});
                }
                
                setPolyVis(0);
                setResultLoc({list:locationList});
                setResultPoly({list:polyList});
                setResultList({list:retResult});
                setResultWindow({list:infoList})
                sessionStorage.setItem("SSbE_result", JSON.stringify(retResult));
              }
              else{
                setResultLoc({list:[]});
                setResultPoly({list:[]});
                setResultList({list:[]});
                setResultWindow({list:[]})
                sessionStorage.setItem("SSbE_result", JSON.stringify([]));

              }
              setRunLORAFlag(Array(runLORAFlag.length).fill(false));
              sessionStorage.setItem("SSbE_disable_btn", JSON.stringify(false));
              window.dispatchEvent(new Event("storage"));
            })
            .catch(function (error){
              console.log(error);
            });
      }
      function clearLORA(){
        const key = sessionStorage.getItem("SSbE_key");
        axios.post('http://localhost:5000/clearData', {key:key}).then(res=>{
              if(res.data.success === true){
                setColorList([]);
                console.log(res.data.message);
              }
            
            })
            .catch(function (error){
              console.log(error);
            });
      
      }
      function getExampleType(input,loop){
        const request = {
          location: centerMarker,
          radius: String(centerRadius),
          query: input
        } 
        const service =  new window.google.maps.places.PlacesService(map);
        service.textSearch(request,   (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              if(results[0].types.length < 3){
                var list = String(input).split(' ');
                var num = Math.floor(list.length / 2);
                var text = String(list[num]);
                for(let l = num+1; l < list.length; l++){
                  text = text + " " + String(list[l]);
                }
                getSearchResults(text, input, loop);
              }
              else{
                var type;
                for(let y = 0; y < results[0].types.length; y++){
                  if(results[0].types[y] !== "establishment" & results[0].types[y] !== "point_of_interest"){
                    type = results[0].types[y];
                    break;
                  }
                  
                }
                getSearchResultsType(type, input, loop);
              }
            }
        });
      }
      function getSearchResultsType(input, original,loop){
        console.log(input, Date.now())
        const typeF = [input];
        const requestT ={
          location: centerMarker,
          radius: String(centerRadius),
          type: typeF
        }
        const outputData=[];
        outputData.push(original);
        const service =  new window.google.maps.places.PlacesService(map);
        service.nearbySearch(requestT,   (results, status, pagination) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            if(pagination.hasNextPage & morePage){
              pagination.nextPage();
            }
            else{
              runLORAFlag[loop] = true;
            }
            const val = sessionStorage.getItem("SSbE_runData")
            const valList = JSON.parse(val);
            for (let i = 0; i < results.length; i++) { 
              var attribute = []; 
              if(results[i]['business_status'] === "OPERATIONAL")
                attribute.push(1);
              else if(results[i]['business_status'] === "CLOSED_TEMPORARILY")
                attribute.push(-1);
              else
                attribute.push(0);

              if(results[i]['rating'] !== 0)
                attribute.push(1);
              else
                attribute.push(0);

              if(results[i]['user_ratings_total'] !== 0)
                attribute.push(1);
              else
                attribute.push(0);
              
              valList.push({"name":results[i]['name'], 
                "geometry":{"lat":results[i]['geometry'].location.lat(), "lng":results[i]['geometry'].location.lng()},
                "types": original, "attribute": attribute
              });
          sessionStorage.setItem("SSbE_runData", JSON.stringify(valList));

            }
          }
          if(outputData.length === 0){
            console.log("NO data")
          }
          
          setColorListName(input)
          console.log(runLORAFlag)
          if(runLORAFlag.findIndex(x=>x === false)===-1){
            runLORA()
          }
          
        });
      }
      function getSearchResults(input, original, loop){
        const request = {
          location: centerMarker,
          radius: String(centerRadius),
          query: input
        } 
        const outputData=[];
        outputData.push(original);
        const service =  new window.google.maps.places.PlacesService(map);
        service.textSearch(request,   (results, status, pagination) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            
            if(pagination.hasNextPage & morePage){
              pagination.nextPage();
            }
            else{
              runLORAFlag[loop] = true;
            }
            const val = sessionStorage.getItem("SSbE_runData")
            const valList = JSON.parse(val);
            for (let i = 0; i < results.length; i++) { 
              var attribute = []; 
              if(results[i]['business_status'] === "OPERATIONAL")
                attribute.push(1);
              else if(results[i]['business_status'] === "CLOSED_TEMPORARILY")
                attribute.push(-1);
              else
                attribute.push(0);

              if(results[i]['rating'] !== 0)
                attribute.push(1);
              else
                attribute.push(0);

              if(results[i]['user_ratings_total'] !== 0)
                attribute.push(1);
              else
                attribute.push(0);
              valList.push({"name":results[i]['name'], 
                "geometry":{"lat":results[i]['geometry'].location.lat(), "lng":results[i]['geometry'].location.lng()},
                "types": original, "attribute": attribute
              });
          sessionStorage.setItem("SSbE_runData", JSON.stringify(valList));

            }
          }
          setColorListName(input)
          if(runLORAFlag.findIndex(x=>x === false)===-1){
            runLORA()
          }
        });
          
      }

      function handleOpenLink(name){
        const url = 'http://www.google.com/maps/search/?api=1&query=' + name
        window.open(url);
      }
      function manageMarker(loc_list, latlng){
          const mList = markerList.list;
          mList.push({id: latlng.lat() +"," + latlng.lng(), pos:{lat:latlng.lat(),lng:latlng.lng()}});
          setMarkerList({list:mList});
          const localMList = markLocalList.list;
          localMList.push( {id: latlng.lat() +"," + latlng.lng(), selection:0 , dataset: loc_list});
          setMarkerLocalList({list:localMList})
          sessionStorage.setItem("SSbE_mark", JSON.stringify(localMList))
          
          sessionStorage.setItem("SSbE_event", 0);
          
          window.dispatchEvent(new Event("storage"));
      }
      function addMarker(latLng){
          var filterList = []
          const t = Date.now()
          var actName;
          const request = {
            location: latLng,
            radius: '30',
          }
          const service =  new window.google.maps.places.PlacesService(map);
          service.nearbySearch(request,   (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            for(let y = 0; y < results.length; y++){
              if(results[y].types.indexOf("politcal") === -1 & results[y].types.indexOf("locality") === -1 
                & results[y].types.indexOf("neighborhood") === -1 & results[y].types.indexOf("route") === -1  ){
                var attribute = []; 
                if(results[y]['business_status'] === "OPERATIONAL")
                  attribute.push(1);
                else if(results[y]['business_status'] === "CLOSED_TEMPORARILY")
                  attribute.push(-1);
                else
                  attribute.push(0);

                if(results[y]['rating'] !== 0)
                  attribute.push(1);
                else
                  attribute.push(0);

                if(results[y]['user_ratings_total'] !== 0)
                  attribute.push(1);
                else
                  attribute.push(0);
                
                actName = results[y]['name'];
                const resultData = {"name":results[y]['name'], 
                    "geometry":{"lat":results[y]['geometry'].location.lat(), "lng":results[y]['geometry'].location.lng()},
                    "types": actName, "attribute": attribute
                }
                filterList.push({name: actName, samData:resultData})
              }
            }
            if(filterList.length === 0){
              alert("No location found! Please zoom in and try again.")
            }
            else{
              manageMarker(filterList,latLng)
            }
             console.log(t-Date.now())
          }})
        
      }
      function deleteMarker(id){
          const mList = markerList.list;
          let index = mList.findIndex(x=> x.id === id);
          
          if(index !== -1)
            mList.splice(index, 1);
          setMarkerList({list:mList});
          
          const localMList = markLocalList.list;
          let index2 = localMList.findIndex(x=> x.id === id);
          if(index2 !== -1)
            localMList.splice(index2, 1);
          
          setMarkerLocalList({list:localMList})
          sessionStorage.setItem("SSbE_mark", JSON.stringify(localMList))
          window.dispatchEvent(new Event("storage"));
      }

      function runLORAMark(){
        const datalist = []
        const datalistR = []
        const markerData = sessionStorage.getItem("SSbE_mark");
        const mDataParse = JSON.parse(markerData);
        const queryList = [];
        for(let l = 0 ; l < mDataParse.length; l++){
          var x = mDataParse[l].selection;
          datalist.push(mDataParse[l].dataset[x].name);
          datalistR.push(mDataParse[l].dataset[x].samData);
          queryList.push(l);
        }
        sessionStorage.setItem("SSbE_query", JSON.stringify(queryList))
        sessionStorage.setItem("SSbE_runData", JSON.stringify(datalistR));
        runBefore(datalist, "MARK")
        
        sessionStorage.setItem("SSbE_searchType", JSON.stringify(datalist));
      }
      function processText(name, datalist, c){
          const request = {
            location: centerMarker,
            query: name
          }
          const service =  new window.google.maps.places.PlacesService(map);
          service.textSearch(request,   (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                var attribute = []; 
                if(results[0]['business_status'] === "OPERATIONAL")
                  attribute.push(1);
                else if(results[0]['business_status'] === "CLOSED_TEMPORARILY")
                  attribute.push(-1);
                else
                  attribute.push(0);
  
                if(results[0]['rating'] !== 0)
                  attribute.push(1);
                else
                  attribute.push(0);
  
                if(results[0]['user_ratings_total'] !== 0)
                  attribute.push(1);
                else
                  attribute.push(0);
                  
                const outputData= {"name":results[0]['name'], 
                    "geometry":{"lat":results[0]['geometry'].location.lat(), "lng":results[0]['geometry'].location.lng()},
                    "types": name, "attribute": attribute
                }
                const val = sessionStorage.getItem("SSbE_runData")
                const valList = JSON.parse(val);
                valList.push(outputData);
                sessionStorage.setItem("SSbE_runData", JSON.stringify(valList));
                console.log(c, datalist.length)
                if((c+1) === datalist.length){
                  console.log("before")
                  runBefore(datalist, "TEXT")
                }
            }
            else{
              console.log(status)
            }
          })
      
      }
      function runLORAText(dataset){
        const datalist = []
        const queryList = [];
        for(let l = 0 ; l < dataset.length; l++){

          queryList.push(l);
          datalist.push(dataset[l]);
          processText(dataset[l], datalist,l)

          
        }
        sessionStorage.setItem("SSbE_query", JSON.stringify(queryList))
        sessionStorage.setItem("SSbE_searchType", JSON.stringify(datalist));
      }
      function runBefore(dataList, type){
        if(morePage)
          setRunLORAFlag(Array(dataList.length).fill(false));
        else
          setRunLORAFlag(Array(dataList.length).fill(true));
        for(let z =0; z < dataList.length; z++){
          getExampleType(dataList[z], z);
        }
      }
      function resetMapLORA(){
        clearLORA();
        setResultLoc({list: []});
        setResultPoly({list:[]});
      }
      
      initial();
      useEffect(() => {
        async function fetchdata()
        {
            
            // let response = await fetch('http://localhost:5000/');
            // console.log(response)
            setLoading(false)
        }
        fetchdata()  
        
        },[isLoading])
      return isLoading ? (<><h2>Wating for server to load. Please hold on.</h2></>) : isLoaded ? 
      (
        <MapControlContext.Consumer>{(mapControlContext) => (
        <AddLocationTwoContext.Consumer>{(addLocTwoContext)=>(
        <AddMapMarkerContext.Consumer>{(addMapMarkerContext) => {
          if (mapControlContext.key !== "" & mapControlContext.data !== ""){
            switch(mapControlContext.key){
              case 1:
                jumpLocation(mapControlContext.data);
                break;
              case 2:
                handleSearchRad(mapControlContext.data);
                break;
              case 3:
                handleNumOfPage(mapControlContext.data);
                break;
              default:
                alert("Unexpected value recieved " + mapControlContext.key)
            }
            mapControlContext.setControl({key:"", data:""})
          }
          if (addLocTwoContext.newvalue !== "" & addLocTwoContext.oldvalue !== ""){
            if(addLocTwoContext.newvalue === -1 & addLocTwoContext.oldvalue === -1){
              handleSort();
            }
            else{
              handlePolygon(addLocTwoContext.newvalue, addLocTwoContext.oldvalue);
            }
            addLocTwoContext.addLocation({new:"", old:""})
          }
          if (addMapMarkerContext.data !== ""  & addMapMarkerContext.fun !== "" & addMapMarkerContext.mode !== "") {
            sessionStorage.setItem("SSbE_sort", "default")
            if(addMapMarkerContext.fun === "RUN"){
              sessionStorage.setItem("SSbE_runData", JSON.stringify([]));
              clearLORA();
              if(addMapMarkerContext.mode === "MARK"){
                runLORAMark();
              }
              else{
                runLORAText(addMapMarkerContext.data);
              }
            }
            else if(addMapMarkerContext.fun === "CLEAR"){
              resetMapLORA();
              setResultWindow({list:[]});
              sessionStorage.setItem("SSbE_result", JSON.stringify([]))
              sessionStorage.setItem("SSbE_searchType", JSON.stringify([]))
              sessionStorage.setItem("SSbE_runData", JSON.stringify([]))
              if(addMapMarkerContext.mode === "MARK"){
                setMarkerList({list:[]});
                setMarkerLocalList({list:[]})
                sessionStorage.setItem("SSbE_mark", JSON.stringify([]))
              }
              else{
                sessionStorage.setItem("SSbE_text", JSON.stringify([]))
              }
            }
            else if(addMapMarkerContext.fun === "UPDATE"){
              setMarkerLocalList({list:addMapMarkerContext.data})
            }
            addMapMarkerContext.setMap({data:"", fun:"", mode:""})
          }
          return(
            <GoogleMap
              id='map'
              mapContainerStyle={containerStyle}
              center={center}
              zoom={zoom}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={options}
              onZoomChanged={()=>onZoomChanged()}
              onCenterChanged={()=>onCenterChanged()}
              clickableIcons={false}
              onClick={(event)=>addMarker(event.latLng)}
              onRightClick={(event)=>setCenterMarker(event.latLng)}
              mapContainerClassName="map"
            >
            
              <Marker id='center' position={centerMarker} draggable ={true} onDragEnd={(e)=>{handleDrag(e)}} 
                label='C' shape='MarkerShapeRect' zIndex={1} onClick={()=>handleCircle()} title="center"/>
              
              <Circle id='circle' center={centerMarker} draggable={false} zIndex={2} radius={centerRadius} options={optionsCircle}
                visible={circleVisible} />

              {markLocalList.list.map(m=>(
                <Marker key={m.id} id={m.id} position={m.dataset[m.selection].samData.geometry} draggable ={false} 
                shape='MarkerShapeRect' onClick={()=>deleteMarker(m.id)} zIndex={0} label={String(markLocalList.list.findIndex(x=> x.id === m.id))}/>
              ))}
              
              { resultLocations.list.map(x=>(
                <Marker key={x.name} id={x.p} position={x.coord} draggable ={false} shape='MarkerShapeRect' zIndex={0} 
                icon={{
                  path:"M24 36.9Q17.15 31.75 13.825 27.05Q10.5 22.35 10.5 17.8Q10.5 14.4 11.725 11.825Q12.95 9.25 14.9 7.5Q16.85 5.75 19.25 4.875Q21.65 4 24 4Q26.35 4 28.75 4.875Q31.15 5.75 33.1 7.5Q35.05 9.25 36.275 11.825Q37.5 14.4 37.5 17.8Q37.5 22.35 34.175 27.05Q30.85 31.75 24 36.9ZM24 21Q25.45 21 26.475 19.975Q27.5 18.95 27.5 17.5Q27.5 16.05 26.475 15.025Q25.45 14 24 14Q22.55 14 21.525 15.025Q20.5 16.05 20.5 17.5Q20.5 18.95 21.525 19.975Q22.55 21 24 21ZM10.5 44V41H37.5V44Z",
                  fillColor: iconColor[x.color][700],
                  fillOpacity: 1,
                  scale: 0.8, 
                  strokeColor: "black",
                  strokeWeight: 1.5,
                  anchor: new window.google.maps.Point(25,40)
                }}
                onClick={()=>{   
                  handleInfoWindow(x.p);
                }}
                />
              ))}
              { resultWindow.list.map(x=>(x.visible ? (
               <InfoWindow key={x.p} id={x.p} position={x.coord} onCloseClick={()=>{handleInfoWindow(x.p)}}
               options={{pixelOffset: new window.google.maps.Size(0,-35)}} >
             {/* <div style={divStyle}> */}
               {/* <p>{ x.name}</p> */}
               <Button onClick={()=>{handleOpenLink(x.name)}} style={{maxHeight:'25px'}}>{x.name}</Button>
             {/* </div> */}
           </InfoWindow>): <></>))}
 
              { resultPolyline.list.map(y=>(
                <Polygon key={y.id} path={y.paths} draggable={false} editable={false}  zIndex={2}
                options={{
                  strokeColor: iconColor[y.id][500],
                  strokeOpacity: 2,
                  strokeWeight: 3,
                  fillColor:  iconColor[y.id][500],
                  fillOpacity: 0
                }}
                visible={y.visible}
                />
              ))}
                <></>
              </GoogleMap>
          )
        } }</AddMapMarkerContext.Consumer>
        )}</AddLocationTwoContext.Consumer>
        )}</MapControlContext.Consumer>
        
      ) : <><h2>{loadError}</h2></>
} 


export default MapComponent