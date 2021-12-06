const app = Vue.createApp({
    data() {
        return {
            //  Value is the value of the dice, hold stops the dice being rolled
            dice: [
                {id: 1, value: 1, hold: false},
                {id: 2, value: 2, hold: false},
                {id: 3, value: 3, hold: false},
                {id: 4, value: 4, hold: false},
                {id: 5, value: 5, hold: false},
            ],
            message: 'Loaded with VueJS',
            score: 0,
            rollsRemain: 3
        }
    },
    methods: {
        rollDice() {
            console.log("Rolling Dice")
            for(let i = 0; i < this.dice.length; i++){
                //  If we're holding the dice, don't update the value
                if(this.dice[i].hold === false){
                    //  Roll a new value between 1 and 6
                    this.dice[i].value = Math.floor((Math.random() * 6) + 1);
                }
            }
            this.rollsRemain--;
        },
        holdDice(id) {
            const dice = this.dice[id - 1];

            console.log(dice)
            dice.hold = !dice.hold
        },
        newScore(tempScore){
            this.score = tempScore
            this.rollsRemain = 3;

            //  Reset all the hold values
            for(let i = 0; i < this.dice.length; i++){
                this.dice[i].hold = false
            }
        }
    }
});

app.component('score-box', {
    //  title: The text displayed on the button
    //  identity: What value the button should look out for
    props: ['title', 'identity'],
    data() {
        return {
            value: 0,           // Holds the value to be displayed in the input
            submitted: false    //  True = has been used by the player, False = hasn't been used
        }
    },
    methods: {
        submitScore(type){
            const dice = this.$parent.dice
            let score = this.$parent.score

            console.log('submit2')
            switch(type){
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                    {
                        let tempScore = 0;
                        let num = parseInt(type);
                        for(let i = 0; i < dice.length; i++){
                            if(dice[i].value === num) tempScore += num;
                        }
                        score += tempScore;
                        this.value = tempScore
                        this.submitted = true;
                        break;
                    }
                default:
                    {
                        console.log(`Invalid Case: ${type}`);
                    }
            }
            //  Update overall score
            this.$parent.newScore(score);
        }
    },
    template: `
    <div class="input-group mb-3">
    <button class="btn btn-outline-secondary" :class="{ disabled: submitted }" type="button" id="button-twos" @click=submitScore(identity)>{{ title }}</button>
        <input type="text" id="input-twos" class="form-control" :value=this.value disabled>
    </div>
    `
})

app.mount("#game");