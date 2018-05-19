//index.js
//获取应用实例
var util = require('../../utils/util.js');
var cityData = require('../../utils/city_data');
const app = getApp()

const date = new Date()
var years = []
var months = []
var days = []

// for (var i = 1990; i <= date.getFullYear(); i++) {
//     years.push(i)
// }

// new cityData.CityData();

years = cityData.cityData.provinces;
months = cityData.cityData.cityList(0);
days = cityData.cityData.townList(0,0);

for (var i = 1 ; i <= 12; i++) {
    months.push(i)
}

for (var i = 1 ; i <= 31; i++) {
    days.push(i)
}

Page({
    data: {
        years:years,
        year: 0,
        months: months,
        month: 0,
        days: days,
        day: 0,
        value: [0, 0, 0],
    },
    bindChange: function(e) {
        const val = e.detail.value;

        console.log(this.data.year);
        console.log(this.data.month);
        console.log(val);

        if( this.data.year != val[0])
        {
            //省份更改
            this.setData(
                {
                    year:val[0],
                    months:cityData.cityData.cityList(val[0]),
                    month:0,
                    days:cityData.cityData.townList(val[0],0),
                    day:0,
                    value:[val[0],0,0]
                }
            );
            return;
        }


        if( this.data.month != val[1] )
        {
            //市级更改
            this.setData(
                {
                    days:cityData.cityData.townList(val[0],val[1]),
                    day:0,
                    value:[val[0],val[1],0]
                }
            );
        }

        // console.log(e.detail.value);
        //
        // this.setData({
        //     year: this.data.years[val[0]],
        //     month: this.data.months[val[1]],
        //     day: this.data.days[val[2]]
        // })
    }
})

