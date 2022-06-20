"use strict";

$(function () {
    var API_KEY = 'e1947b1588f086d456fbe476f20aaccb';
    var defaultCity = 'Tokyo';
    var win = {
        width: 375,
        height: window.outerHeight,
    }
    var city = {
        name: '',
        date: '',
        time: '',
        main: '',
        weather: '',
        description: '',
        temp: '',
        tempMin: '',
        tempMax: '',
        feelsLike: '',
        pressure: '',
        humidity: '',
        windSpeed: '',
        WindSpeedUnit: '',
        windDeg: '',
        cloudsAll: '',
        sunriseDate: '',
        sunriseTime: '',
        sunsetDate: '',
        sunsetTime: '',
    };
    var UNIT = {
        TEMP: 'ﾂｰ',
        PRESSURE: 'hPa',
        HUMIDITY: '%',
        WINDSPEED: 'm/s',
        MIDDLE_DOT: ':'
    }
    var current = {
        day: '',
        month: '',
        date: '',
        hours: '',
        minitutes: '',
        time: '',
        timeText: '',
    }
    var cloud = {
        type: 'img/cloud01.png',
        color: 0xffffff,
    }
    var rain = {
        num: 0,
        speed: 105,
        array: [],
    }
    var snow = {
        num: 0,
        speed: -2,
        array: [],
    }

    //蜈･繧翫�縺ｿ繧｢繝九Γ繝ｼ繧ｷ繝ｧ繝ｳ
    function enterAnimation() {
        anime.timeline().add({
            easing: 'easeInSine',
            targets: '.city-wrap',
            duration: 500,
            delay: 100,
            opacity: [0, 1],
            translateY: ['5px', 0]
        });
    }

    //蜈･繧�&蜃ｺ繧九い繝九Γ繝ｼ繧ｷ繝ｧ繝ｳ
    function lemoveAnimation() {
        anime.timeline().add({
                easing: 'easeOutSine',
                targets: '.city-wrap',
                duration: 200,
                delay: 0,
                opacity: [1, 0],
                translateY: [0, '5px']
            })
            .add({
                easing: 'easeInSine',
                targets: '.city-wrap',
                duration: 200,
                delay: 100,
                opacity: [0, 1],
                translateY: ['5px', 0]
            });
    }

    //迴ｾ蝨ｨ縺ｮ螟ｩ豌励ｒ蜿門ｾ�
    function currentWeather() {
        $.ajax({
                url: '//api.openweathermap.org/data/2.5/weather?q=' + defaultCity + ',jp&units=metric&appid=' + API_KEY,
                dataType: 'json',
                type: 'GET'
            })
            .done(function (data) {
                getWeatherData(data);
                createDate(city.date);
                getDiscription(city.description);
                weatherBgInit();
                weatherBgAnimate();
                rainSnowInit();
                rainSnowAnimloop();
                domWeatherWrite();
                enterAnimation();
                $('#weather-back').click(function () {
                    getWeatherData(data);
                    createDate(city.date);
                    getDiscription(city.description);
                    weatherBgInit();
                    weatherBgAnimate();
                    rainSnowInit();
                    rainSnowAnimloop();
                    lemoveAnimation();
                    setTimeout(function () {
                        domWeatherWrite();
                    }, 200);
                    $('#weather-back').css('display', 'none');
                });
            })
            .fail(function (data) {
                console.log('迴ｾ蝨ｨ縺ｮ螟ｩ豌励ｒ蜿門ｾ怜�譚･縺ｾ縺帙ｓ縺ｧ縺励◆縲�')
            });
    }

    //繝��繧ｿ譬ｼ邏�
    function getWeatherData(data) {
        (data.name) ? city.name = data.name.toUpperCase(): city.name;
        city.main = data.weather[0].main;
        city.description = data.weather[0].description;
        city.date = new Date(data.dt * 1000);
        city.temp = Math.round(data.main.temp);
        city.tempMin = Math.round(data.main.temp_min);
        city.tempMax = Math.round(data.main.temp_max);
        city.feelsLike = Math.round(data.main.feels_like);
        city.pressure = Math.round(data.main.pressure);
        city.humidity = Math.round(data.main.humidity);
        city.windSpeed = Math.round(data.wind.speed);
        city.windDeg = Math.round(data.wind.deg);
        city.cloudsAll = Math.round(data.clouds.all);
        (data.sys.sunrise) ? city.sunriseDate = new Date(data.sys.sunrise * 1000): city.sunriseDate = undefined; //unixtime to date
        (data.sys.sunset) ? city.sunsetDate = new Date(data.sys.sunset * 1000): city.sunsetDate = undefined; //unixtime to date
        if (city.sunriseDate && city.sunsetDate) {
            city.sunriseTime = city.sunriseDate.getHours() + ':' + city.sunriseDate.getMinutes();
            city.sunsetTime = city.sunsetDate.getHours() + ':' + city.sunsetDate.getMinutes();
        } else {
            city.sunriseTime = '-';
            city.sunsetTime = '-';
        }
    }

    //譌･莉�&譎る俣蜿門ｾ�
    function createDate(date) {
        current.day = date;
        current.month = current.day.getMonth() + 1;
        current.date = current.month + '/' + current.day.getDate();
        current.hours = current.day.getHours();
        current.minitutes = ('0' + current.day.getMinutes()).slice(-2);
        current.time = current.hours + ':' + current.minitutes;
        current.timeText = current.date + ' ' + current.time;
    }

    //DOM隕∫ｴ�縺ｫ謠丞�
    function domWeatherWrite() {
        $('#city-name').html(city.name);
        $('#weather-temp').html(city.temp + UNIT.TEMP);
        $('#tempMin').html(city.tempMin + UNIT.TEMP);
        $('#tempMax').html(city.tempMax + UNIT.TEMP);
        $('#feelsLike').html(city.feelsLike + UNIT.TEMP);
        $('#humidity').html(city.humidity + UNIT.HUMIDITY);
        $('#sunrise').html(city.sunriseTime);
        $('#sunset').html(city.sunsetTime);
        $('#windSpeedUnit').html(city.windSpeed + UNIT.WINDSPEED);
        $('#pressure').html(city.pressure + UNIT.PRESSURE);
        $('#weather-date').html(current.timeText);
        $('.detail-list').css('display', 'flex');
    }

    //3譎る俣縺斐→縺ｮ螟ｩ豌励ｒ蜿門ｾ�
    function threeWeather() {
        $.ajax({
                url: '//api.openweathermap.org/data/2.5/forecast?q=' + defaultCity + ',jp&units=metric&appid=' + API_KEY,
                dataType: 'json',
                type: 'GET'
            })
            .done(function (data) {
                var insertHTML = '';
                for (var i = 0; i <= 20; i++) {
                    insertHTML += domThreeWeatherWrite(data, i);
                }
                $('#weather-report').html(insertHTML);

                $('.weather-reportItem').click(function () {
                    var targetNum = $(this).index();
                    getWeatherData(data.list[targetNum]);
                    createDate(new Date(data.list[targetNum].dt * 1000));
                    getDiscription(city.description);
                    weatherBgInit(new Date(data.list[targetNum].dt * 1000));
                    weatherBgAnimate();
                    rainSnowInit();
                    rainSnowAnimloop();
                    lemoveAnimation();
                    setTimeout(function () {
                        domWeatherWrite();
                    }, 200);
                    $('#weather-back').css('display', 'block');
                    setTimeout(function () {
                        $('body, html').animate({
                            scrollTop: 0
                        }, 300, 'linear');
                    }, 500)
                });
            })
            .fail(function (data) {
                console.log('3譎る俣縺斐→縺ｮ螟ｩ豌励ｒ蜿門ｾ怜�譚･縺ｾ縺帙ｓ縺ｧ縺励◆縲�')
            });
    }

    function weatherInit() {
        currentWeather();
        threeWeather();
    }

    //DOM隕∫ｴ�縺ｫ謠丞� 3譎る俣縺斐→ver
    function domThreeWeatherWrite(data, i) {
        var week = new Array("(譌･)", "(譛�)", "(轣ｫ)", "(豌ｴ)", "(譛ｨ)", "(驥�)", "(蝨�)");
        var date_txt = data.list[i].dt_txt;
        var date = new Date(date_txt.replace(/-/g, "/"));
        date.setHours(date.getHours() + 9);
        var month = date.getMonth() + 1;
        var day = month + "/" + date.getDate();
        var week = week[date.getDay()];
        var time = date.getHours() + "��00";
        var main = (data.list[i].weather[0].main).toLowerCase();
        var html =
            '<div class="weather-reportItem">' +
            '<div class="weather-day">' + day + '</div>' +
            '<div class="weather-week">' + week + '</div>' +
            '<div class="weather-time">' + time + '</div>' +
            '<div class="weather-main ' + main + '"></div>' +
            '<div class="weather-temp">' + Math.round(data.list[i].main.temp) + UNIT.TEMP + '</div>' +
            '</div>';
        return html
    }

    //螟ｩ豌玲ュ蝣ｱ蛻�ｲ�
    function getDiscription(disc) {
        switch (disc) {
            case 'clear sky':
                rain.num = 0;
                snow.num = 0;
                $('#weatherBg').removeClass('thunder');
                return $('#weather-discription').html('蠢ｫ譎ｴ');
                break;
            case 'few clouds':
                rain.num = 0;
                snow.num = 0;
                $('#weatherBg').removeClass('thunder');
                return $('#weather-discription').html('縺上ｂ繧奇ｼ磯峇蟆代↑繧�ｼ�');
                break;
            case 'scattered clouds':
                rain.num = 0;
                snow.num = 0;
                $('#weatherBg').removeClass('thunder');
                return $('#weather-discription').html('縺上ｂ繧奇ｼ磯峇縺ｵ縺､縺�ｼ�');
                break;
            case 'broken clouds':
                rain.num = 0;
                snow.num = 0;
                $('#weatherBg').removeClass('thunder');
                return $('#weather-discription').html('縺上ｂ繧奇ｼ磯峇螟壹ａ��');
                break;
            case 'overcast clouds':
                rain.num = 0;
                snow.num = 0;
                $('#weatherBg').removeClass('thunder');
                return $('#weather-discription').html('縺上ｂ繧奇ｼ磯峇螟壹ａ��');
                break;
            case 'light intensity shower rain':
                rain.num = 10;
                snow.num = 0;
                $('#weatherBg').removeClass('thunder');
                return $('#weather-discription').html('蟆城岑縺ｮ縺ｫ繧上°髮ｨ');
                break;
            case 'shower rain':
                rain.num = 160;
                snow.num = 0;
                $('#weatherBg').removeClass('thunder');
                return $('#weather-discription').html('縺ｫ繧上°髮ｨ');
                break;
            case 'heavy intensity shower rain':
                rain.num = 200;
                snow.num = 0;
                $('#weatherBg').removeClass('thunder');
                return $('#weather-discription').html('螟ｧ髮ｨ縺ｮ縺ｫ繧上°髮ｨ');
                break;
            case 'light rain':
                rain.num = 10;
                snow.num = 0;
                $('#weatherBg').removeClass('thunder');
                return $('#weather-discription').html('蟆城岑');
                break;
            case 'moderate rain':
                rain.num = 160;
                snow.num = 0;
                $('#weatherBg').removeClass('thunder');
                return $('#weather-discription').html('髮ｨ');
                break;
            case 'heavy intensity rain':
                rain.num = 200;
                snow.num = 0;
                $('#weatherBg').removeClass('thunder');
                return $('#weather-discription').html('螟ｧ髮ｨ');
                break;
            case 'very heavy rain':
                rain.num = 280;
                snow.num = 0;
                $('#weatherBg').removeClass('thunder');
                return $('#weather-discription').html('豼縺励＞螟ｧ髮ｨ');
                break;
            case 'rain':
                rain.num = 160;
                snow.num = 0;
                $('#weatherBg').removeClass('thunder');
                return $('#weather-discription').html('髮ｨ');
                break;
            case 'thunderstorm':
                rain.num = 160;
                snow.num = 0;
                $('#weatherBg').addClass('thunder');
                return $('#weather-discription').html('髮ｷ髮ｨ');
                break;
            case 'snow':
                rain.num = 0;
                snow.num = 80;
                $('#weatherBg').removeClass('thunder');
                return $('#weather-discription').html('髮ｪ');
                break;
            case 'mist':
                rain.num = 0;
                snow.num = 0;
                $('#weatherBg').removeClass('thunder');
                return $('#weather-discription').html('髱�');
                break;
            case 'tornado':
                rain.num = 0;
                snow.num = 0;
                $('#weatherBg').removeClass('thunder');
                return $('#weather-discription').html('蠑ｷ鬚ｨ');
                break;
            default:
                return disc;
        }
    }


    var camera, scene, renderer, material, mesh, clock, light, cloudTexture, cloudMaterial, cubeSineDriver, cloudGeo, cloudParticles, delta;

    //閭梧勹canvas謠丞�
    function weatherBgInit() {
        var dom = document.getElementById('canvasCloud');
        clock = new THREE.Clock();
        renderer = new THREE.WebGLRenderer({
            alpha: true
        });
        renderer.setPixelRatio(1);

        //閭梧勹繧ｫ繝ｩ繝ｼ蛻�ｲ�
        var currentHour = city.date.getHours();
        var currentMinitue = city.date.getMinutes() / 60;
        var currentTime = currentHour + currentMinitue;

        if (city.sunriseDate && city.sunsetDate) {
            var sunriseHour = city.sunriseDate.getHours();
            var sunriseMinute = city.sunriseDate.getMinutes() / 60;
            var sunriseTime = sunriseHour + sunriseMinute;
            var sunsetHour = city.sunsetDate.getHours();
            var sunsetMinute = city.sunsetDate.getMinutes() / 60;
            var sunsetTime = sunsetHour + sunsetMinute;
        } else {
            var sunriseTime = 5;
            var sunsetTime = 18;
        }

        //譌･荳ｭ
        if (currentTime >= sunriseTime && currentTime < sunsetTime) {
            console.log(city.main);
            if (!(city.main == 'Rain')) {
                renderer.setClearColor(0x4185D0, 1);
            } else {
                renderer.setClearColor(0x334d68, 1);
            }
            cloud.color = 0xffffff;
            cloud.type = 'img/cloud01.png';
        }
        //螟�
        else {
            renderer.setClearColor(0x12161a, 1);
            cloud.color = 0x808080;
            cloud.type = 'img/cloud02.png';
        }

        // renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setSize(win.width, win.height);
        scene = new THREE.Scene();

        //camera
        camera = new THREE.PerspectiveCamera(75, win.width / win.height, 1, 10000);
        camera.position.z = 1000;
        scene.add(camera);

        //light
        light = new THREE.DirectionalLight(0xffffff, 1.5);
        light.position.set(0, 0, 1);
        scene.add(light);

        //cloud
        // THREE.ImageUtils.crossOrigin = ''; 
        cloudTexture = THREE.ImageUtils.loadTexture(cloud.type);
        cloudMaterial = new THREE.MeshLambertMaterial({
            color: cloud.color,
            map: cloudTexture,
            transparent: true
        });
        cloudGeo = new THREE.PlaneGeometry(300, 300);
        cloudParticles = [];

        //髮ｲ縺ｮ謠丞�
        var clouds = city.cloudsAll;
        for (var p = 0; p < clouds; p++) {
            var particle = new THREE.Mesh(cloudGeo, cloudMaterial);
            particle.position.set(Math.random() * 1000 - 800, Math.random() * 100 + 400, Math.random() * 1000); //髮ｲ縺ｮ謠丞�繝舌Λ繝ｳ繧ｹ(x,y,z)
            scene.add(particle);
            cloudParticles.push(particle);
        }

        //domWrite
        dom.innerHTML = '';
        dom.appendChild(renderer.domElement);

    }

    //髮ｲ縺ｮ遘ｻ蜍�
    function moveCloud() {
        var cloudLng = cloudParticles.length;
        var winW = win.width;
        var cloudSpeed = city.windSpeed;
        while (cloudLng--) {
            cloudParticles[cloudLng].position.x += (delta * cloudSpeed);
            if (cloudParticles[cloudLng].position.x > winW / 1.5) {
                cloudParticles[cloudLng].position.x = -0.3 * winW;
            }
        }
    }

    //render
    function render() {
        renderer.render(scene, camera);

    }

    //繧｢繝九Γ繝ｼ繧ｷ繝ｧ繝ｳ
    function weatherBgAnimate() {
        delta = clock.getDelta();
        requestAnimationFrame(weatherBgAnimate);
        moveCloud();
        render();
    }

    //rain&snow
    var canvasRain = document.getElementById('canvasRain');
    var canvasSnow = document.getElementById('canvasSnow');
    var ctx1 = canvasRain.getContext('2d');
    var ctx2 = canvasSnow.getContext('2d');

    var w = canvasRain.width = canvasSnow.width = win.width;
    var h = canvasRain.height = canvasSnow.height = win.height;
    window.addEventListener('resize', function () {
        w = canvasRain.width = canvasSnow.width = win.width;
        h = canvasRain.height = canvasSnow.height = win.height;
    });

    function random(min, max) {
        return Math.random() * (max - min + 1) + min;
    }

    function clearcanvasRain() {
        ctx1.clearRect(0, 0, w, h);
    }

    function clearcanvasSnow() {
        ctx2.clearRect(0, 0, canvasSnow.width, canvasSnow.height);
    }

    function createRain() {
        for (var i = 0; i < rain.num; i++) {
            rain.array[i] = {
                x: random(0, w),
                y: random(0, h),
                length: Math.floor(random(1, 830)),
                opacity: Math.random() * 0.2,
                xs: random(-2, 2),
                ys: random(10, 20)
            };
        }
    }

    function createSnow() {
        for (var i = 0; i < snow.num; i++) {
            snow.array[i] = {
                x: Math.random() * w,
                y: Math.random() * h,
                l: Math.random() * 1,
                xs: -4 + Math.random() * 4 + 2,
                ys: Math.random() * 2 + 4
            };
        }
    }

    function drawRain(i) {
        ctx1.beginPath();
        var grd = ctx1.createLinearGradient(0, rain.array[i].y, 0, rain.array[i].y + rain.array[i].length);
        grd.addColorStop(0, "rgba(255,255,255,0)");
        grd.addColorStop(1, "rgba(255,255,255," + rain.array[i].opacity + ")");

        ctx1.fillStyle = grd;
        ctx1.fillRect(rain.array[i].x, rain.array[i].y, 1, rain.array[i].length);
        ctx1.fill();
    }

    function drawSnow(i) {
        ctx2.beginPath();
        ctx2.moveTo(snow.array[i].x, snow.array[i].y);
        ctx2.lineTo(snow.array[i].x + snow.array[i].l * snow.array[i].xs, snow.array[i].y + snow.array[i].l * snow.array[i].ys);
        ctx2.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx2.lineWidth = 5;
        ctx2.lineCap = 'round';
        ctx2.stroke();
    }

    function animateRain() {
        clearcanvasRain();
        for (var i = 0; i < rain.num; i++) {
            if (rain.array[i].y >= h) {
                rain.array[i].y = h - rain.array[i].y - rain.array[i].length * 5;
            } else {
                rain.array[i].y += rain.speed;
            }
            drawRain(i);
        }
    }

    function animateSnow() {
        clearcanvasSnow();
        for (var i = 0; i < snow.num; i++) {
            snow.array[i].x += snow.array[i].xs;
            snow.array[i].y += snow.array[i].ys;
            if (snow.array[i].x > w || snow.array[i].y > h) {
                snow.array[i].x = Math.random() * w;
                snow.array[i].y = -20;
            } else {
                snow.array[i].y += snow.speed;
            }
            drawSnow(i);
        }
    }

    function rainSnowInit() {
        createRain();
        createSnow();
        window.addEventListener('resize', createRain);
        window.addEventListener('resize', createSnow);
    }

    function rainSnowAnimloop() {
        animateRain();
        animateSnow();
        requestAnimationFrame(rainSnowAnimloop);
    }

    weatherInit();

});