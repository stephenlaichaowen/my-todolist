const LOCAL_STORAGE_LIST_KEY = 'stephen.todolist'
const api = {
  key: '4d6518a119bdca2651f98d1ca0e63f84',
  base: 'https://api.openweathermap.org/data/2.5/'
}
new Vue({
  el: '#app',
  data() {
    return {
      todoList: [],
      new_todo: '',
      showComplete: false,
      toggleIcon: true,
      message: true,
      clear: true,
      clearTodo: 'Clear All',
      showMessage: true,
      todoStatus: true,
      doneMessage: true,
      day: true,
      completedStatus: true,
      currentTemp: '',
      weatherIcon: '',
      ajax: true
    };
  },
  mounted() {
    this.todoList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
    axios
      .get(`${api.base}weather?q=taipei&units=metric&APPID=${api.key}`)
      .then(res => {
        this.ajax = false
        console.log(res.data)
        const data = res.data       
        this.currentTemp = data.main.temp
        this.weather = data.weather[0].main
        console.log(this.weather);
        if (this.weather == 'Clouds') this.$refs.weatherIcon.classList.add('fa-cloud')
        if (this.weather == 'Sunny') this.$refs.weatherIcon.classList.add('fa-sun')
      })
  },
  watch: {
    todoList: {
      handler: function (updatedList) {
        localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(updatedList));
      },
      deep: true
    }
  },
  computed: {
    pending() {
      return this.todoList.filter(function (item) {
        return !item.done;
      })
    },
    completed() {
      return this.todoList.filter(function (item) {
        return item.done;
      });
    },
    completedPercentage() {
      return (Math.floor((this.completed.length / this.todoList.length) * 100)) + "%";
    },
    today() {
      var weekdayEnglish = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var weekdayChinese = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //January is 0!
      var yyyy = today.getFullYear();

      if (dd < 10) { dd = '0' + dd }
      if (mm < 10) { mm = '0' + mm }

      today = {
        day: this.day ? weekdayEnglish[today.getDay()] : weekdayChinese[today.getDay()],
        // date: mm + '-' + dd + '-' + yyyy,
        date: `${mm}-${dd}-${yyyy}`,
      }
      return (today);
    }
  },
  methods: {   
    displayChinese() {
      this.toggleIcon = false
      this.message = false
      this.clear = false
      if (!this.toggleIcon) this.clearTodo = '刪除所有項目'
      this.$refs.inputBox.placeholder = '輸入您的代辦事項'
      this.todoStatus = false
      this.doneMessage = false
      this.day = false
      this.completedStatus = false
    },
    displayEnglish() {
      this.toggleIcon = true
      this.message = true
      this.clear = true
      if (this.toggleIcon) this.clearTodo = 'Clear All'
      this.$refs.inputBox.placeholder = 'Enter your todo item here...'
      this.todoStatus = true
      this.doneMessage = true
      this.day = true
      this.completedStatus = true
    },
    getTodos() {
      if (localStorage.getItem('todo_list')) {
        this.todoList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY));
      }
    },
    addItem() {
      if (this.new_todo) {
        this.todoList.unshift({
          id: this.todoList.length,
          title: this.new_todo,
          done: false,
          date: this.today.day,
          day: this.today.date,
        });
      }
      this.new_todo = '';
      return true;
    },
    deleteItem(item) {
      this.todoList.splice(this.todoList.indexOf(item), 1);
      // const box = confirm('Are you sure to dele this item ?')
      // if (box == true) {
      //   this.todoList.splice(this.todoList.indexOf(item), 1);
      // } else {
      //   return
      // }
    },
    toggleShowComplete() {
      this.showComplete = !this.showComplete;
    },
    clearAll() {
      // const box = confirm('Are you sure to dele this item ?')
      // if (box == true) {
      //   this.todoList = [];
      // } else {
      //   return
      // }        
      this.todoList = [];
    }
  },
});
