<template>
<div>
    <h3>{{theQuiz.title}} Question: {{currentNumber+1}}</h3>
    <p>{{theQuiz.questions[currentNumber].question}}</p>
    <div id="responses">
        <div v-for="(choice, key) in theQuiz.questions[currentNumber].choices">
            <input type="radio" id="'chosen'+key" :value="choice" v-model="chosen"><label :for="'chosen'+key">{{choice}}</label><br/>
        </div>
        <p v-if="chosen">This is your response: {{chosen}}</p>
        <button v-if="chosen && !theQuiz.questions[currentNumber].completed" @click="submit(chosen)">Submit Answer</button>
    </div>
    <button v-if="currentNumber!==0 && completedQuests.length+1!==theQuiz.questions.length && currentNumber-small!==0" @click="prevQuest">Prev Question</button>
    <button v-if="completedQuests.length+1!==theQuiz.questions.length" @click="nextQuest(chosen)">Next Question</button>
    <div id="select">
        <select v-model="currentNumber" @change="selectQuest(currentNumber)">
            <option v-for="(question,key) in theQuiz.questions" v-if="!question.completed" v-bind:value="key">
                {{key+1}}
            </option>
        </select>
    </div>
</div>
</template>



<script>

// export anonymous object from this module so it can be accessed by others when imported
export default {
    name: 'App',
    // these values will be filled in by parent component, values must match tag's attribute names
    props:[
        'theQuiz',
        'currentNumber',
        'chosen',
        'allResponses',
        'completedQuests',
        'nextQuest',
        'prevQuest',
        'selectQuest',
        'submit',
        'small'
    ]
}

</script>


