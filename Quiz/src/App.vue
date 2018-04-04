<template>
  <div id="app">
    <div id="selection" v-if="selectQuiz">
        <h1>{{ msg }}</h1>
        <ul>
            <button @click="choseMathQuiz()">Math</button>
            <button @click="choseDukeQuiz()">Duke</button>
        </ul>
    </div>
    <div id="quiz" v-if="quizChosen">
            <dukeQuiz
                :currentNumber="currentQuestion"
                :theQuiz="currentQuiz"
                :allResponses="responses"
                :chosen="currentResponse"
                :completedQuestions="completedQuestions"
                v-on:chosen="addCurrentNumber">
            </dukeQuiz>
        <button v-if="currentQuestion > 0" @click="prevNumber()">Prev Question</button>
        <button v-if="currentQuestion + 1 < currentQuiz.questions.length" @click="addCurrentNumber()">Next Question</button>
        <button v-if="currentQuestion + 1 === currentQuiz.questions.length" @click="finishQuiz()">Finish Quiz</button>
        <button @click="returnSelection()">Return To Selection Screen</button>
    </div>
  </div>
</template>

<script>
    import math from '../data/math_questions.json'
    import duke from '../data/duke_questions.json'
    import mathQuiz from './components/mathQuiz'
    import dukeQuiz from './components/dukeQuiz'
export default {
  name: 'app',
  data () {
    return {
      msg: 'Select a quiz to take:',
      myMath: math,
      myDuke: duke,
      selectQuiz: true,
      quizChosen: false,
      currentQuiz: '',
      currentQuizMsg: '',
      currentQuestion:0,
      responses: [],
      currentResponse: '',
      completedQuestions: []
    }
  },
  components:{
    dukeQuiz,
    mathQuiz
  },
  methods:{
    choseMathQuiz(){
        this.selectQuiz=false
        this.quizChosen=true
        this.currentQuizMsg=this.myMath.title
        this.currentQuiz=this.myMath
        console.log(this.currentQuiz)
    },
    choseDukeQuiz(){
        this.selectQuiz=false
        this.quizChosen=true
        this.currentQuizMsg=this.myDuke.title
        this.currentQuiz=this.myDuke
        console.log(this.currentQuiz.questions[0].question)    
    },
    returnSelection(){
        this.quizChosen=false
        this.selectQuiz=true
    },
    addCurrentNumber(e){
        if(this.currentResponse !== null){
            this.currentQuiz.questions[this.currentQuestion].completed = true
            this.responses[this.currentQuestion] = this.currentResponse
            this.currentResponse = ''
            this.currentQuestion = this.currentQuestion+1
            console.log("Responses" + this.responses)
            console.log("currentResponse" + this.currentResponse)
        }
        else{
            return false
        }
        
    },
    prevNumber(){
        this.currentQuestion = this.currentQuestion-1
    },
    finishQuiz(){
        this.currentQuestion = 0
    },
    
  }
  
}
</script>



<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
