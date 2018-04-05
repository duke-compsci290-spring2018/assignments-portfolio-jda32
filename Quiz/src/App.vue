<template>
  <div id="app">
    <div id="selection" v-if="selectQuiz">
        <h1>{{ msg }}</h1>
        <ul>
            <button @click="choseMathQuiz()">Math</button>
            <button @click="choseDukeQuiz()">Duke</button>
        </ul>
        <h3 v-if="prevQuiz">Previous Quiz: {{prevQuiz.title}} </br> Score: {{prevQuiz.correct}}  out of {{prevQuiz.tries}}</h3>
    </div>
    <div id="quiz" v-if="quizChosen">
            <dukeQuiz
                :currentNumber="currentQuestion"
                :theQuiz="currentQuiz"
                :allResponses="responses"
                :chosen="currentResponse"
                :completedQuests="completedQuestions"
                :nextQuest="addCurrentNumber"
                :prevQuest="prevNumber"
                :selectQuest="choseQuestion"
                :submit="submitAnswer"
                :small="smallest">
            </dukeQuiz>
        <!-- <button v-if="currentQuestion > 0" @click="prevNumber()">Prev Question</button> -->
        <!-- <button v-if="currentQuestion + 1 < currentQuiz.questions.length" @click="addCurrentNumber()">Next Question</button> -->
        <button v-if="completedQuestions.length+1 === currentQuiz.questions.length" @click="finishQuiz()">Finish Quiz</button>
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
      quizes: [math,duke],
      selectQuiz: true,
      quizChosen: false,
      currentQuiz: '',
      prevQuiz: '',
      currentQuizMsg: '',
      currentQuestion:0,
      responses: [],
      currentResponse: '',
      completedQuestions: [],
      remainingQuestions: [],
      tries: 0,
      correct: 0,
      smallest: 0
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
        for(var i = 0; i < this.currentQuiz.questions.length; i++){
            this.remainingQuestions.push(i)
            console.log(i)
        }
        console.log(this.remainingQuestions)
        console.log(this.currentQuiz)
    },
    choseDukeQuiz(){
        this.selectQuiz=false
        this.quizChosen=true
        this.currentQuizMsg=this.myDuke.title
        this.currentQuiz=this.myDuke
        for(var i = 0; i < this.currentQuiz.questions.length; i++){
            this.remainingQuestions.push(i)
            console.log(i)
        }
        console.log(this.currentQuiz.questions[0].question)    
    },
    returnSelection(){
        this.quizChosen=false
        this.selectQuiz=true
    },
    addCurrentNumber: function(e){
            this.currentQuestion = this.currentQuestion+1
            while(this.completedQuestions.includes(this.currentQuestion)){
                this.currentQuestion = this.currentQuestion+1
            } 
    },
    prevNumber(){
        var dummy = this.currentQuestion
        console.log("Dummy:" + dummy)
        dummy = dummy -1
        while(dummy >= 0){
            if(this.remainingQuestions.includes(dummy)){
                this.currentQuestion = dummy
                break
            }
            console.log(dummy)
            console.log(this.remainingQuestions)
            dummy = dummy - 1
        }
    },
    choseQuestion(e){
        this.currentQuestion = e
    },
    submitAnswer(e){
        console.log(this.currentQuiz.questions[this.currentQuestion].correctAnswer)
        console.log("E: " + e)
        if(this.currentQuiz.questions[this.currentQuestion].completed === true){
            alert("Already Answered Question")
        }
        else{
            if(this.currentQuiz.questions[this.currentQuestion].correctAnswer === this.currentQuiz.questions[this.currentQuestion].choices.indexOf(e)){
                alert("CORRECT")
                this.correct++
                this.tries++
                this.currentQuiz.questions[this.currentQuestion].completed=true
                this.completedQuestions.push(this.currentQuestion)
                var index = this.remainingQuestions.indexOf(this.currentQuestion)
                if(index > -1){
                        this.remainingQuestions.splice(index, 1)
                    }
                while(this.completedQuestions.includes(this.currentQuestion) && this.completedQuestions.length < this.currentQuiz.questions.length){
                    if(this.currentQuestion === this.currentQuiz.questions.length-1){
                        this.currentQuestion = 0
                     }
                     else{
                        this.currentQuestion = this.currentQuestion+1
                     }
                    
                }
                if(this.remainingQuestions.length > 0){
                    var temp = this.remainingQuestions[0]
                    for(var i = 0; i<this.remainingQuestions.length;i++){
                        if(this.remainingQuestions[i] < temp){
                            temp = this.remainingQuestions[i]
                        }
                    }
                    this.smallest = temp
                }
                if(this.remainingQuestions.length === 0){
                    console.log("Finished")
                    this.currentQuiz.tries = this.tries
                    this.currentQuiz.correct = this.correct
                    this.currentQuiz.finished = true
                    this.prevQuiz= this.currentQuiz
                    this.completedQuestions = []
                    this.quizChosen=false
                    this.selectQuiz=true
                    for(var i=0; i < this.currentQuiz.questions.length; i++){
                        this.currentQuiz.questions[i].completed = false
                    }
                    this.currentQuiz=''
                    this.currentQuestion=0
                    this.correct = 0
                    this.tries = 0
                }
            }
            else{
                alert("WRONG")
                this.tries++
            }
        }
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
