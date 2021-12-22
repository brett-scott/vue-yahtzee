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
        //  To compare for 3 or 4 of a kind and Yahtzee
        duplicateCheck(type){
            const dice = this.$parent.dice

            let compArray = [];
            let tempScore = 0;
            

            //  Get all the dice values, and get the total duplicates
            for(let i = 0; i < dice.length; i++){
                compArray[dice[i].value] = (compArray[dice[i].value] || 0) + 1
                tempScore += dice[i].value
            }

            //  Check if any values came up 3 or more times
            const aboveLimit = compArray.find(num => num >= parseInt(type))

            //  Set score to 0 as it wasn't above the limit
            if(!aboveLimit) {
                tempScore = 0;
            }

            return tempScore;
        },
        straightCheck(len){
            const dice = this.$parent.dice;

            let compArray = [];
            //  Starts at one to count the number being compared
            let straightCount = 1;

            //  Get all dice values
            for(let i = 0; i < dice.length; i++){
                compArray.push(dice[i].value);
            }

            //  Sort the numbers in incremental order
            compArray.sort(function(a, b) {
                return a - b;
            });

            //  Remove duplicate numbers, easier to count
            uniqueCompArray = compArray.filter(function(elem, pos) {
                return compArray.indexOf(elem) == pos;
            })

            //  Loop through numbers
            for(let i = 0; i < compArray.length - 1; i++){
                let num = compArray[i];

                //  Check if current number + 1 is equal to the next number
                if(num + 1 === compArray[i + 1]){
                    straightCount++
                }
            }

            //  Fix for straight checking 4 when there's 5
            if(len === 4 && straightCount === 5) straightCount = 4

            return straightCount === len;
        },
        submitScore(type){
            const dice = this.$parent.dice
            let score = this.$parent.score
            let tempScore = 0;

            switch(type){
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                    {
                        let num = parseInt(type);
                        for(let i = 0; i < dice.length; i++){
                            if(dice[i].value === num) tempScore += num;
                        }
                        score += tempScore;
                        this.value = tempScore
                        this.submitted = true;
                        break;
                    }
                case "3x":
                    {
                        const res = this.duplicateCheck(3);

                        score += res;
                        this.value = res
                        this.submitted = true;

                        break;
                    }
                case "4x":
                    {
                        const res = this.duplicateCheck(4);

                        score += res;
                        this.value = res;
                        this.submitted = true;

                        break;
                    }
                case "fh":  //  Full House
                    {
                        let compArray = [];
                        
                        //  Store number of duplicates in an array
                        for(let i = 0; i < dice.length; i++){
                            compArray[dice[i].value] = (compArray[dice[i].value] || 0) + 1
                        }

                        //  Check if 2 of the same value and 3 of the same value exist
                        if(compArray.includes(2) && compArray.includes(3)){
                            score += 25;
                            this.value = 25;
                        } else {
                            score += 0;
                            this.value = 0;
                        }

                        this.submitted = true;

                        break;
                    }
                case "ss":  //  Small Straight
                    {
                        const res = this.straightCheck(4);
                        const points = 30;

                        if(res){
                            score += points;
                            this.value = points;
                        } else {
                            score += 0;
                            this.value = 0;
                        }

                        this.submitted = true;
                        break;
                    }
                case "ls":  //  Large Straight
                    {
                        const res = this.straightCheck(5);
                        const points = 40;

                        if(res){
                            score += points;
                            this.value = points;
                        } else {
                            score += 0;
                            this.value = 0;
                        }

                        this.submitted = true;
                        break;
                    }
                case "yahtzee":
                    {
                        const res = this.duplicateCheck(5);

                        if(res != 0){  //  A score existing means a Yahtzee was found
                            score += 50;
                            this.value = 50;
                        } else {
                            score += res;
                            this.value = res;
                        }
                        
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