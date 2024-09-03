document.addEventListener('alpine:init', () => {
    Alpine.data('totalPhoneBill', () => ({
        title:'My Total Phone Bill',
        pricePlans: [],
        plan: '',
        actions: '',
        newPlan: '',
        smsPrice: '',
        callPrice: '',
        idNum: '',
        total: '',
        message: '',
        existingPlan: '',
        newCallPrice: '',
        newSmsPrice: '',
        showPricePlan: false,
        planIdToDelete: '',
        message: '',

        async listPricePlans(){
                        try{
                             const result=await axios.get('/api/price-plans');
                            this.pricePlans=result.data.data; // coz the file itself is called data so you fetching data from a data file
                         console.log(result);
                        }catch(error){
                            console.error('Unable to list price plans:', error);
                            
                        }
                        
                     }, 

       

        togglePricePlan() {
            this.showPricePlan = !this.showPricePlan;
            console.log(this.showPricePlan ? "Table is shown" : "Table is hidden");
        },

        calculateTotal() {
            return axios.post('http://localhost:4011/api/phonebill',{
                "plan_name": this.plan,
                "actions": this.actions
            })
            .then(response =>{
                this.total = response.data.total;
                this.plan ='';
                this.actions = '';

                setTimeout(() => {
                    this.total = '';
                }, 4000);
            })
            .catch(error => {
                console.error('Unable to calculate total', error);
            });  
        },

        createPricePlan() {
            const smsPriceNum = parseFloat(this.smsPrice); //floating the values whilst converting the list into a number.
            const callPriceNum = parseFloat(this.callPrice);
          
            if (isNaN(smsPriceNum) || isNaN(callPriceNum)) {
              console.error('Please ensure Sms and Call prices are numbers.');
              return;
            }
          
            return axios.post('http://localhost:4011/api/price-plan/create', {
                "plan_name": this.newPlan,
                "sms_price": smsPriceNum,
                "call_price": callPriceNum,
                
            })
            .then(response => {
                console.log(response.data.message);
                this.newPlan = '';
                this.smsPrice = '';
                this.callPrice = '';
                
                  
                this.listPricePlans();

             })
            
            .catch(error => {
                console.error('Unable to create price plan:', error);
            });
          },
          
          updatePricePlan() {
            const newSmsPriceNum = parseFloat(this.newSmsPrice); // Convert to number
            const newCallPriceNum = parseFloat(this.newCallPrice); // Convert to number
        
            // Validate input fields
            if (!this.existingPlan || isNaN(newSmsPriceNum) || isNaN(newCallPriceNum)) {
                console.error('Please provide a plan name and valid numeric values for SMS and Call prices.');
                this.message = 'Invalid inputs entered. Please try again.';
                return;
            }
        
            // Make the POST request to update the price plan
            return axios.post('http://localhost:4011/api/price-plan/update', {
                "plan_name": this.existingPlan,
                "sms_price": newSmsPriceNum,
                "call_price": newCallPriceNum,
            })
            .then(response => {
                console.log('Response from server:', response.data);
        
                // Update message and clear inputs
                this.message = response.data.message || 'Price Plan updated successfully!';
                this.existingPlan = '';
                this.newSmsPrice = '';
                this.newCallPrice = '';
        
                // Refresh the list of price plans to reflect the update
                this.listPricePlans();
        
                // Clear the message after a timeout
                setTimeout(() => {
                    this.message = '';
                }, 4000);
            })
            .catch(error => {
                console.error('Error updating price plan:', error);
                this.message = error.response?.data?.error || 'Failed to update the price plan. Please try again later.';
            });
        },

        
       

        deletePricePlan() {
            // Ensure that a valid ID is provided
            const planId = parseInt(this.planIdToDelete);
            if (isNaN(planId) || planId <= 0) {
                console.error('Invalid ID entered.');
                this.message = 'Invalid ID entered. Please try again.';
                return;
            }

            return axios.post('http://localhost:4011/api/price-plan/delete', {
                id: planId
            })
            .then(response => {
                console.log('Response from server:', response.data);

                this.message = response.data.message || 'Price plan deleted successfully!';
                this.planIdToDelete = '';  
                this.listPricePlans(); 
                setTimeout(() => {
                    this.message = '';
                }, 4000);
            })
            .catch(error => {
                console.error('Error deleting price plan:', error);
                this.message = error.response?.data?.error || 'Failed to delete the price plan. Please try again later.';
            });
        },

    }))
})








 

