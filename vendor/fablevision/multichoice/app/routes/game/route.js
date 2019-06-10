const Route = async() => {
    let template = await fetch('routes/game/index.html');
    template = await template.text();

    return {
        template,
        data: function(){
            return {
                question: this.getQuestion(),
                selected: [],
                result: ""
            }
        },
        methods: {
            getQuestion(level = this.$root.user.level){
                // Get a list of question candidates
                let questions = this.$root.questions.filter(question => question.level === level);
                let questionIndex = Math.floor(Math.random() * questions.length);

                // Keep an array of asked questions (per content area). If we've asked all questions, then reset (but keep the last question, so we don't get it twice in a row).
                if(!this.$root.state.askedQuestions[level]) this.$root.state.askedQuestions[level] = [];
                if(this.$root.state.askedQuestions[level].length === questions.length) this.$root.state.askedQuestions[level] = [questions.indexOf(this.question)];

                // Make sure we haven't already asked this question before. And if we have, find a new one.
                while(this.$root.state.askedQuestions[level].indexOf(questionIndex) > -1){
                    questionIndex = Math.floor(Math.random() * questions.length);
                }
                
                let question = questions[questionIndex];

                // Keep track of what we've already asked
                this.$root.state.askedQuestions[level].push(questionIndex);

                // Shuffle answers
                question.answers = this.shuffleAnswers(question);
                
                return question;
            },

            getResult(){
                let correct = true;

                // Make sure only correct answers were selected
                for(let index in this.selected){
                    if(this.selected[index] && this.question.answers[index].value === false) correct = false;
                }
                
                // Make sure we have the correct number of correct answers
                let correctAnswers = this.question.answers.filter(answer => answer.value === true);
                if(correctAnswers.length !== this.selected.filter(key => key === true).length) correct = false;

                
                if(correct){
                    this.$root.playSoundFX('correct');
                }else{
                    this.$root.playSoundFX('incorrect');
                }

                // TODO: Langage?
                this.result = (correct)?"Correct":"Incorrect";

                window.setTimeout(() => {
                    this.$root.playSoundFX('changetarget');
                    this.reset();
                }, 1000);

                return correct;
            },
            
            shuffleAnswers: function(question){
                let answers = [...question.answers]; // Make a copy

                // Shuffle
                for (let i = answers.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [answers[i], answers[j]] = [answers[j], answers[i]];
                }

                return answers;
            },

            selectAnswer(index){
                this.$root.$set(this.selected, index, !this.selected[index]);
            },

            reset(){
                this.question = this.getQuestion();
                this.selected = [];
                this.result = "";
            }
        }
    }
}

export default Route;