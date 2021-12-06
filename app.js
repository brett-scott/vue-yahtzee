const app = Vue.createApp({
    data() {
        return {
            //  Value is the value of the dice, hold stops the dice being rolled
            dice: [
                {id: 1, value: 1, hold: false},
                {id: 2, value: 2, hold: false},
                {id: 3, value: 3, hold: true},
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
        submitScore(type) {
            switch(type){
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    {
                        let tempScore = 0;
                        let num = parseInt(type);
                        for(let i = 0; i < this.dice.length; i++){
                            if(this.dice[i].value === num) tempScore += num;
                        }
                        this.score += tempScore;
                        this.rollsRemain = 3;
                        break;
                    }
                default:
                    {
                        console.log(`Invalid Case: ${type}`);
                    }
            }
        }
    }
});

app.component('score-box', {
    props: ['title', 'yahtzee-score'],
    emits: ['yahtzee-score'],
    data() {
        return {
            value: 0
        }
    },
    methods: {
        submitScore2(type){
            const dice = this.$parent.dice
            let score = this.$parent.score
            let rollsRemain = this.$parent.rollsRemain

            console.log('submit2')
            console.log(this.parentData)
            switch(type){
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    {
                        let tempScore = 0;
                        let num = parseInt(type);
                        for(let i = 0; i < dice.length; i++){
                            if(dice[i].value === num) tempScore += num;
                        }
                        score += tempScore;
                        console.log(score)
                        rollsRemain = 3;
                        break;
                    }
                default:
                    {
                        console.log(`Invalid Case: ${type}`);
                    }
            }
        }
    },
    // <button class="btn btn-outline-secondary" type="button" id="button-twos" @click=this.$parent.submitScore(2)>{{ title }}</button>
    // <button class="btn btn-outline-secondary" type="button" id="button-twos" @click=submitScore2(2)>{{ title }}</button>
    template: `
    <div class="input-group mb-3">
        <button class="btn btn-outline-secondary" type="button" id="button-twos" @click="yahtzee-score(2)">{{ title }}</button>
        <input type="text" id="input-twos" class="form-control" value="0" disabled>
    </div>
    `
})

app.mount("#game");