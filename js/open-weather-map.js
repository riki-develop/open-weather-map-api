// >>>> 1Day Request
// const targetCityName = "ishigaki";
// const TodayRequest = "https://api.openweathermap.org/data/2.5/weather?APPID="
// + appId
// + "&lang=ja&units=metric&q="
// + targetCityName
// + ",jp;";


// >>>> 5Days Request
const callApi = async () =>
{
    const apiKey = "30dbd4ffb8eb7b4daf88e04ef1d32391";
    const cityName = "ishigaki";

    const requesutUrl = "https://api.openweathermap.org/data/2.5/forecast?q="
    + cityName
    + "&APPID="
    + apiKey;

    // 非同期処理
    const obj = await fetch(requesutUrl)
    .then(res => {
        console.log('data取得成功')
        return res.json()
    })
    .catch(error => {
        console.log('data取得失敗')
        return null
    })
    console.table(obj)

    // 加工したデータをループしてHTMLを格納
    let insertHTML = ''
    for(let i = 0; i <= 39; i++) {
        insertHTML += domThreeWeatherWrite(obj, i)
    }
    document.querySelector('#weather-report')
    .insertAdjacentHTML('afterbegin', insertHTML)

    // データ加工
    function domThreeWeatherWrite(obj, i)
    {
        // 曜日・日付・時間
        let week = ["(日)", "(月)", "(火)", "(水)", "(木)", "(金)", "(土)"]
        let dt = obj.list[i].dt_txt
        let date = new Date(dt.replace(/-/g, "/"))
            date.setHours(date.getHours() + 9)
        let month = date.getMonth() + 1
        let day = month + "/" + date.getDate()
        let dayClass = date.getDate()
            week = week[date.getDay()]
        let time = date.getHours() + "：00"
        console.log(day + '  ' + time)

        // 天気・風向・風速
        let main = (obj.list[i].weather[0].main).toLowerCase()
        let temp = obj.list[i].main.temp - 273.15
            temp = temp.toFixed(0)
        let deg = obj.list[i].wind.deg
        let speed = obj.list[i].wind.speed

        // 天気アイコン条件分岐
        let icon =
            main === 'clear' ? 'weather_sky.png' :
            main === 'clouds' ? 'weather_cloud.png' :
            main === 'rain' ? 'weather_rain.png': ''
        iconImg = '<img src="icon/' + icon + '">'

        // 風向
        let windDeg =
            deg >= 22.6 && deg <= 67.5 ? '北東' :
            deg >= 67.6 && deg <= 112.5 ? '東' :
            deg >= 112.6 && deg <= 157.5 ? '南東' :
            deg >= 157.6 && deg <= 202.5 ? '南' :
            deg >= 202.6 && deg <= 247.5 ? '南西' :
            deg >= 247.6 && deg <= 292.5 ? '西' :
            deg >= 292.6 && deg <= 337.5 ? '北西' : '北'

        // jsonから取り出した値をHTMLに内包
        let html =
            '<div class="weather-report-inner ' + 'day-' + dayClass + '">' +
                '<div class="weather-day">' + day +
                    '<span class="weather-week">' + week + '</span>' +
                '</div>' +
                '<div class="weather-time">' + time + '</div>' +
                '<div class="weather-main ' + main + '">' + iconImg + '</div>' +
                '<div class="weather-temp">' + temp + ' ℃' + '</div>' +
                '<div class="weather-deg">' + deg + '：' + windDeg + '</div>' +
                '<div class="weather-speed">' + speed + ' m/s' + '</div>' +
            '</div>'
        return html
    }

    adjustElement = () =>
    {
        // 当日から5日間を配列に格納
        let dayArry = []
        let parent = document.getElementById('weather-report')

        for(let i= 0; i <= 5; i++) {
            let param = Date.now() + (i * 86400000);
            let d = new Date(param).getDate()
                dt = 'day-' + d
            dayArry.push(dt)

            let children = document.getElementsByClassName(dt)
            let len = children.length

            for(let j = 1; j < len; j++) {
                parent.removeChild(children[1]);
            }
        }
    }
    adjustElement()
}
callApi()