<template>
 <div class="dashboard-containers">
     <el-row type="flex" justify="end"><el-col :span="6">
       <el-date-picker v-model="weekDateTime" @change="changeTime" type="week"  format="yyyy 第 W 周"  placeholder="选择周"  :picker-options="{firstDayOfWeek: 1 }">
         </el-date-picker>
         </el-col></el-row>
         <el-row>
         </el-row>
    <full-calendar ref="calendar"
      :event-sources="eventSources"
      @event-selected="eventSelected"
      :changeTimes="gotoDate"
      :config="config">
    </full-calendar>
  </div>
</template>

<script>
function titleWeekSign(item, str, weektitle, weekName) {
  if (weektitle === weekName) {
    item.innerHTML = "<span class='weekNameCss weekNameCss_Action'>" + str + "</span><span class='weekName'>" + weekName + '</span>'
  } else {
    item.innerHTML = "<span class='weekNameCss'>" + str + "</span><span class='weekName'>" + weekName + '</span>'
  }
}

function titleWeek() {
  let weektitle
  const weekNumber = new Date().getDay()
  const weekDate = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
  for (let index = 0; index < weekDate.length; index++) {
    if (weekNumber === index) {
      weektitle = weekDate[index]
    }
  }

  [...$('.fc-row.fc-widget-header table tr').children()].forEach(
    (item, index) => {
      if (item.innerText.length > 5) {
        if (index) {
          var weekName
          var str = ''
          if (item.innerText.slice(5).length > 1) {
            weekName = item.innerText.slice(0, 2)
            str = item.innerText.slice(5)
            if (isNaN(item.innerText.slice(5))) {
              if (str.slice(1, 3).length > 1) {
                str = str.slice(1, 4)
              } else {
                str = 0 + str.slice(1, 2)
              }
            }
            titleWeekSign(item, str, weektitle, weekName)
          }
        }
      }
    }

  )
}

function ReCssright() {
  $('.arrow_box')
    .removeClass('arrow_box_right')
    .addClass('arrow_box_left')
}

function ReCssleft() {
  $('.arrow_box')
    .removeClass('arrow_box_left')
    .addClass('arrow_box_right')
}

function unMonthDiv() {
  $('.fc-time-grid-container').append("<div  class='parent_arrow'><div class='arrow_box'></div></div>")
}

function success() {
  $('a.success').append(" <b class='succeshtml'></b>")
  $('a').css('left', '0%')
  $('a.res').css({ 'right': '0%', 'margin-right': '0%' })
  // $('a.overlap').css({ 'border': '1px solid ' })
}
let IS_SUCCESS = false
import { mapState } from 'vuex'
import $ from 'jquery'
export default {
  name: 'fullcalendar',
  props: {
    gotoDate: String,
    events: Array // 数据源
  },
  data() {
    return {
      weekDateTime: new Date(),
      isBloo: false,
      config: {
        allDaySlot: false,
        locale: 'ZH-CN',
        weekMode: 'variable',
        slotDuration: '00:15:00',
        minTime: '06:00:00',
        maxTime: '24:00:00',
        slotLabelFormat: 'HH:mm',
        defaultView: 'agendaWeek',
        selectable: false,
        editable: false,
        eventOverlap: true,
        views: {
          month: {
            titleFormat: 'YYYY, MM, DD'
          }
        },

        eventLimit: false,
        // selectable: false,
        nowIndicator: false,
        header: {
          left: '  ',
          center: '',
          right: '  '
        },
        groupByDateAndResource: true,
        eventAfterRender: function(event, element, view) {
          success()
          if (!IS_SUCCESS) {
            titleWeek()
            IS_SUCCESS = true
          }
        },
        eventMouseover: (event, jsEvent, view) => {
          const devicesWidth = document.body.clientWidth
          var clent = parseInt($(jsEvent.target).css('height')) / 2
          var offTop = parseInt($(jsEvent.target).css('top')) - clent - 50
          var initWdth = ($('#calendar').width() - 76) / 7
          var sidebar = this.$store.getters.sidebar.opened
          if (event.type !== '4') {
            $('.parent_arrow').show()
          }
          var tip = event.tip
          var lessons = ''
          tip.title.forEach((item, index) => {
            if (index) {
              lessons += '<p><span class="TextSpace">' + item.testClass + '</span> </p>'
            } else {
              lessons += "<p><span class='item_dot' style='background-color:" + item.titleColor + "'></span ><span class='TextSpaceFrist' style='color:" + item.titleColor + "'>" + item.testClass + '</span></p>'
            }
          })

          var ele = "<div class='arrow_box_Padding'><div class='item_padding'>" + lessons + "</div><div class='item_padding item_bottom'><i class='el-icon-time'></i><span class='TextSpace-small'>" + tip.timeQuantum + tip.weekDay + '从' + tip.startTime + '到' + tip.endTime + '</span><span>(' + tip.badlyTime + '' + ' 分钟 ' + ")</span></span></span></div><div class='item_padding item_bottom'><span><i class='item-icon-message'></i><sapn class='TextSpace-small'>备注:" + tip.remark + '</sapn></spa></div></div>'
          $('.arrow_box').html(ele)

          var MoLeft, Molefts, isWidth
          if (sidebar) {
            isWidth = 251 + 3 * initWdth
            MoLeft = jsEvent.clientX - jsEvent.offsetX + initWdth - 180
            if (devicesWidth <= 1366) {
              Molefts = jsEvent.target.getBoundingClientRect().left - 318 - initWdth - initWdth * 0.58
            } else {
              Molefts = jsEvent.target.getBoundingClientRect().left - 318 - initWdth
            }
          } else {
            isWidth = 51 + 3 * initWdth
            MoLeft = jsEvent.clientX - jsEvent.offsetX + initWdth - 40
            Molefts = jsEvent.clientX - jsEvent.offsetX - 3 * initWdth + 60
          }

          if (jsEvent.clientX < isWidth) {
            $('.parent_arrow').css({ top: offTop, left: MoLeft })
            ReCssleft()
          } else {
            $('.parent_arrow').css({ top: offTop, left: Molefts })
            ReCssright()
          }
        },
        eventMouseout: function(event, jsEvent, view) {
          $('.parent_arrow').hide()
          $('.parent_arrow').css({ top: 0, left: 0 })
          $('.arrow_box').empty()
        },
        eventClick: (event, t, r) => {
          this.$emit('event-click', event, t, r)
        },
        dayClick: event => {
          this.$emit('day-click', event)
        }
      },
      selected: {}
    }
  },

  created() {},
  beforeMount() {
    $('.timeIcon').append('')
  },

  methods: {
    refreshEvents() {
      this.$refs.calendar.$emit('refetch-events')
      this.$refs.calendar.fireMethod('gotoDate')
      this.update()
    },

    removeEvent() {
      this.$refs.calendar.$emit('remove-event', this.selected)
      this.selected = {}
    },

    eventSelected(event) {
      this.selected = { ...event, source: {}}
      console.log(event)
    },

    // 事件创建
    getEle() {
      $('.fc-agenda-view .fc-day-grid').hide()
      unMonthDiv()
      titleWeek()
      success()
    },
    refresh() {
      const weekDate = JSON.stringify(this.weekDateTime)
      this.$refs.calendar.fireMethod('gotoDate', weekDate.substr(1, 10))
    },
    // 日期选择
    changeTime() {
      const weekDate = JSON.stringify(this.weekDateTime)
      this.$emit('selection-changeTime', weekDate.substr(1, 10), this.update)
    },
    update() {
      const weekDate = JSON.stringify(this.weekDateTime)
      this.$refs.calendar.fireMethod('gotoDate', weekDate.substr(1, 10))
      titleWeek()
      success()
    }
  },

  computed: {
    ...mapState(['sidebar']),
    eventSources() {
      const self = this
      return [
        {
          events(start, end, timezone, callback) {
            callback(self.events)
          }
        }
      ]
    }
  },

  mounted() {
    this.getEle()
  },
  watch: {
    'events': function() {
      this.refreshEvents()
    }
  }
}
</script>

<style>
@import "fullcalendar/dist/fullcalendar.css";

b.succeshtml {
    display: inline-block;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 40px;
    height: 40px;
    background-size: 93%;
    background-position-y: 4px;
    background-position-x: 4px;
    background-repeat: no-repeat;
    /* background-image: url('../../assets/iconPng/finish.png') */
}
a.fullsuccess {
    left: 0%;
}

/* .fc-event{
  border:none
} */
a.overlap {
    border: 3px solid ;
    z-index: 10 !important;
    margin-right: 0px !important;

}
.fc-bg{
  pointer-events: none;
}
a.res{
  margin-right:0px;
}
.fc-view-container{
    overflow: visible !important;
}
.fc-time-grid-container, .fc-time-grid{
   overflow: visible !important;

}
.fc-view, .fc-view > table {
    height: 2000px;
    position: relative;
    z-index: 1;
}
.arrow_box {
  position: relative;
  background: #ffffff;
  border: 1px solid #9e989842;
  border-radius:5px;
}
.arrow_box.arrow_box_left:after,
.arrow_box.arrow_box_left:before {
  left: 100%;
  top: 50%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.arrow_box.arrow_box_left:after {
  border-color: #25192100;
  border-left-color: #ffffff;
  border-width: 12px;
  margin-top: -12px;
}
.arrow_box.arrow_box_left:before {
  border-color: rgba(158, 152, 152, 0);
  border-left-color: #9e989842;
  border-width: 15px;
  margin-top: -15px;
}

.arrow_box.arrow_box_right:after,
.arrow_box.arrow_box_right:before {
  right: 100%;
  top: 50%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.arrow_box.arrow_box_right:after {
  border-color: rgba(255, 255, 255, 0);
 border-right-color: #fff;
  border-width: 12px;
  margin-top: -12px;
}
.arrow_box.arrow_box_right:before {
  border-color: rgba(158, 152, 152, 0);
  border-right-color: #9e989842;
  border-width: 15px;
  margin-top: -15px;
}

.parent_arrow {
  pointer-events:none;
  z-index: 100;
  position: absolute;
  top: 0;
  /* display: block; */
  border-radius:5px;
}

.itemPadding {
  padding: 7px 13px;
}

.arrow_box_Padding {
  border-radius:5px;
  width: 280px;
  padding: 10px 18px;
}

.item_padding{
   padding: 10px 15px;
   font-size: 14px;
   color: #ccc;

}
.item_bottom{
  border-bottom: 1px solid #9e989842;
   margin-left: 0px;
}
.item_dot{
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius:50%;

}
.item_dot_red{
 background-color: red;
}
.item_dotred{
  text-indent: 15px;
  color: red
}
span.TextSpaceFrist{
    padding-left: 10px;
}
span.TextSpace{
  padding-left: 20px;
}
span.TextSpace-small{
  padding-left:10px;
}
.item-icon-message{
  display: inline-block;
  width: 17px;
  height: 15px;
  background-repeat: no-repeat;
  position: relative;
  top: 2px;
  /* background-image:url('../../assets/iconPng/message.png') */
}
.myself .el-checkbox__inner::after{
  border: none!important;
}
label.el-checkbox.is-checked.blue
  > span.el-checkbox__input.is-checked.is-focus
  span.el-checkbox__inner,
label.el-checkbox.is-checked.blue
  > span.el-checkbox__input.is-checked
  span.el-checkbox__inner {
  background-color: #74A8FB;
  border-color: #74A8FB;
}
label.el-checkbox.is-checked.blue > span.el-checkbox__label {
  color: grey;
}

label.el-checkbox.is-checked.grey
  > span.el-checkbox__input.is-checked.is-focus
  span.el-checkbox__inner,
label.el-checkbox.is-checked.grey
  > span.el-checkbox__input.is-checked
  span.el-checkbox__inner {
  background-color: #C0C4CC;
  border-color: #C0C4CC;
}
label.el-checkbox.is-checked.grey > span.el-checkbox__label {
  color: grey;
}

label.el-checkbox.is-checked.red
  > span.el-checkbox__input.is-checked.is-focus
  span.el-checkbox__inner,
label.el-checkbox.is-checked.red
  > span.el-checkbox__input.is-checked
  span.el-checkbox__inner {
  background-color: #F9645A;
  border-color: #F9645A;
}
label.el-checkbox.is-checked.red > span.el-checkbox__label {
  color: grey;
}

label.el-checkbox.is-checked.orange
  > span.el-checkbox__input.is-checked.is-focus
  span.el-checkbox__inner,
label.el-checkbox.is-checked.orange
  > span.el-checkbox__input.is-checked
  span.el-checkbox__inner {
  background-color: #F5A623 ;
  border-color: #F5A623;
}
label.el-checkbox.is-checked.orange > span.el-checkbox__label {
  color: grey;
}
label.el-checkbox.is-checked.green
  > span.el-checkbox__input.is-checked.is-focus
  span.el-checkbox__inner,
label.el-checkbox.is-checked.green
  > span.el-checkbox__input.is-checked
  span.el-checkbox__inner {
  background-color: #7ED321;
  border-color: #7ED321;
}
label.el-checkbox.is-checked.green > span.el-checkbox__label {
  color: grey;
}

label.el-checkbox.is-checked.purple
  > span.el-checkbox__input.is-checked.is-focus
  span.el-checkbox__inner,
label.el-checkbox.is-checked.purple
  > span.el-checkbox__input.is-checked
  span.el-checkbox__inner {
  background-color: rgba(180, 104, 244, 1);
  border-color: rgba(180, 104, 244, 1);
}
label.el-checkbox.is-checked.purple > span.el-checkbox__label {
  color: grey;
}

label.el-checkbox.is-checked.black
  > span.el-checkbox__input.is-checked.is-focus
  span.el-checkbox__inner,
label.el-checkbox.is-checked.black
  > span.el-checkbox__input.is-checked
  span.el-checkbox__inner {
  background-color: rgba(144, 147, 153, 1);
  border-color: rgba(144, 147, 153, 1);
}
label.el-checkbox.is-checked.black > span.el-checkbox__label {
  color: grey;
}

label.el-checkbox.is-checked.lightgrey
  > span.el-checkbox__input.is-checked.is-focus
  span.el-checkbox__inner,
label.el-checkbox.is-checked.lightgrey
  > span.el-checkbox__input.is-checked
  span.el-checkbox__inner {
  background-color: rgba(159, 178, 199, 1);
  border-color: rgba(159, 178, 199, 1);
}
label.el-checkbox.is-checked.lightgrey > span.el-checkbox__label {
  color: grey;
}

table {
  background:none;
}

.weekName {
  font-size: 13px;
}
.weekNameCss {
    margin-right: 10px;
    text-align: center;
    width: 25px;
    height: 25px;
    line-height: 25px;
    display: inline-block;
    border-radius: 50%;
    font-size: 13px;
    font-weight: lighter;
}
.weekNameCss_Action {
  color: #fff;
  background-color:#2c7eff;
}

th.fc-day-header {
    padding: 10px 0px;
}
.fc-content{
   pointer-events:none;
}
</style>

