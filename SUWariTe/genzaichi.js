// <!-- 動作処理 -->
/* アクセス時の現在地取得処理 */
function initMap() {
  // Geolocation APIに対応している
  // navigator.geolocationは対応しているときtrue
  if (navigator.geolocation) {
    // 現在地を取得してpositionを返す
    navigator.geolocation.getCurrentPosition(
      // 取得成功した場合
      function (position) {
        // 緯度・経度を変数に格納latitude緯度longitude経度
        var startposition = [position.coords.latitude,position.coords.longitude]
        var mapLatLng = new google.maps.LatLng(startposition[0], startposition[1]);
        // マップオブジェクト作成
        let map = new google.maps.Map(
          document.getElementById("map"), { // マップを表示する要素 (id=map) // マップオプション
            zoom: 17, // 拡大倍率
            center: mapLatLng // 緯度・経度
          });
        //　マップに現在地にマーカーを表示する
        marker = new google.maps.Marker({
          map: map, // 対象の地図オブジェクト
          position: mapLatLng, // 緯度・経度
          icon: 'mappin.png' //マップ用アイコン
        });
        var request = {
          location: mapLatLng, //緯度・経度
          radius: 500, // ※１ 表示する半径領域を設定(1 = 1M)
          types: ['cafe', 'restaurant'] // ※２ typesプロパティの施設タイプを設定
        };
        let service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
        // 検索結果を受け取る
        function callback(results, status) {
          //表のストア情報のリセット
          let stores = document.getElementById('stores');
          while (stores.lastChild) {
            stores.removeChild(stores.lastChild);
          }
          // Placesが検索に成功したかをチェック
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < results.length; i++) {
              // 検索結果の数だけ反復処理を変数placeに格納
              let place = results[i];
              console.log(place)
              let storeinfo = "<td>" + place.name + "</td><td>"+ place.vicinity + "</td>";
              createMarker({
                position: place.geometry.location,
                text: place.name,
                map: map //マーカーを置くmapを指定
              });
              //親となる要素の取得
              let table = document.getElementById("stores");
              //tbody要素を作成
              let tr_element = document.createElement("tr")
              //tbody要素のhtmlを変更
              tr_element.innerHTML = storeinfo
              //親要素へ情報を格納
              table.appendChild(tr_element)
            }
          }
        };
      },
      // 取得失敗した場合
      function (error) {
        // エラーメッセージを表示
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            alert("位置情報の利用が許可されていません");
            break;
          case 2: // POSITION_UNAVAILABLE
            alert("現在位置が取得できませんでした");
            break;
          case 3: // TIMEOUT
            alert("タイムアウトになりました");
            break;
          default:
            alert("その他のエラー(エラーコード:" + error.code + ")");
            break;
        }
      }
    );
    // 該当する位置にマーカーを表示
    function createMarker(options) {
      // Markerを作成
      var marker = new google.maps.Marker(options);
      // 各施設の吹き出し(情報ウインドウ)に表示させる処理
      var infoWnd = new google.maps.InfoWindow();
      infoWnd.setContent(options.text);
      // ルート描画オブジェクトに入る情報
      // let rendererOptions = {
      //   map: map, // 描画先の地図
      //   draggable: true, // ドラッグ可
      //   preserveViewport: true // centerの座標、ズームレベルで表示
      //   };
      // let directionsservice = new google.maps.DirectionsService(); // ルート検索オブジェクト
      // let directionsrenderer = new google.maps.DirectionsRenderer(rendererOptions); // ルート描画オブジェクト
      // let request ={
      //   origin: new google.maps.LatLng(startposition[0], startposition[1]),
      //   destination: new  google.maps.LatLng()
      //   travelMode: google.maps.DirectionsTravelMode.WALKING, 交通手段の選択（今回は徒歩） 
      // }
      // // addListenerメソッドを使ってイベントリスナーを登録
      google.maps.event.addListener(marker, 'click', function () {
        infoWnd.open(map, marker);
        // directionsservice.route(request, function(result,status){
        //   if (status == google.maps.DirectionsStatus.OK) {
        //     directionsrenderer.setDirections(result);
        // }
        // });
      });
    }
  } else { // Geolocation APIに対応していない
    alert("この端末では位置情報が取得できません");
  }
};
