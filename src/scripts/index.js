// const supportedCards = {
//        visa, mastercard
//      };
//
     const countries = [
       {
         code: "US",
         currency: "USD",
         country: 'United States'
       },
       {
         code: "NG",
         currency: "NGN",
         country: 'Nigeria'
       },
       {
         code: 'KE',
         currency: 'KES',
         country: 'Kenya'
       },
       {
         code: 'UG',
         currency: 'UGX',
         country: 'Uganda'
       },
       {
         code: 'RW',
         currency: 'RWF',
         country: 'Rwanda'
       },
       {
         code: 'TZ',
         currency: 'TZS',
         country: 'Tanzania'
       },
       {
         code: 'ZA',
         currency: 'ZAR',
         country: 'South Africa'
       },
       {
         code: 'CM',
         currency: 'XAF',
         country: 'Cameroon'
       },
       {
         code: 'GH',
         currency: 'GHS',
         country: 'Ghana'
       }
     ];




     //JavaScript
     const appState={
       //todo

     };

     const formatAsMoney=(amount,buyerCountry)=>{
       let country=[];
       let i;
       for(i of countries){
         if (i.country==buyerCountry){
           country.push(i.currency);
         }
         if (i.country==null){
           country.push("USD");
         }

       };

       const money=amount.toLocaleString(country[0],{
         style:'currency',
         currency:country[0]
       });

       return money;

     };

     //validating input entries
     const flagIfInvalid=(field,isValid)=>{
       if (isValid){
         field.classList.remove('is-invalid');
       }else{
         field.classList.add('is-invalid');
       }
     };

     const expiryDateFormatIsValid=(target)=>{
       let newDate=target.split("/");
       let intDate=parseInt(newDate[0]);
       if((intDate<=12 && intDate>0) && newDate[1].length==2){
         return true;
       }else{
         return false;
       }
     };

     const detectCardType=({target})=>{
       const number=target.value
       if (number.startsWith("4")){
         document.querySelector("[data-credit-card]").classList.add('is-visa')
         document.querySelector('[data-credit-card]').classList.remove('is-mastercard');
         // document.querySelector('[data-card-type]').src=supportedCards.visa;

         return 'is-visa';
       }
       else if (number.startsWith("5")){
         let masterClass=document.querySelector('[data-credit-card]');
         masterClass.classList.add("is-mastercard")
         masterClass.classList.remove('is-visa');
         // document.querySelector('[data-card-type]').src=supportedCards.mastercard;

         return 'is-mastercard';
       }
       else{
         document.querySelector('[data-credit-card]').classList.remove("is-visa");
         document.querySelector("[data-credit-card]").classList.remove("is-mastercard");
       }
     };

     const validateCardExpiryDate=({target})=>{
       let result=expiryDateFormatIsValid(target);
       let targetClass=document.querySelector('[data-cc-info] input:nth-child(2)');
       if (result){
         flagIfInvalid(targetClass,result);
         return true;
       }else{
         flagIfInvalid(targetClass,result);
         return false;
       };



     };
     const validateCardHolderName=({target})=>{
       let targetClass=document.querySelector('[data-cc-info] >input');
       let name=target.split(" ");
       if (name.length==2 && name[0].length>2 && name[1].length>2){
         flagIfInvalid(targetClass,true);
         return true;
       }
       else{
         flagIfInvalid(targetClass,false);
         return false;
       };

     };

   const validateWithLun=(digits)=>{
      const digitsInString=digits.toString()
       const digitsNewArray=[];
       let z;
       for(z of digitsInString){
         digitsNewArray.push(parseInt(z))
       };
       console.log(digitsNewArray)
       let i;
       const doubleDigits=[];
       for (i=0;i<digitsNewArray.length-1;i++){
         doubleDigits.push(digitsNewArray[i]*2)
       }

       console.log(doubleDigits)
       const doubleCheckDigits=[];
       let j;
       for (j of doubleDigits){
         if (j>9){
           doubleCheckDigits.push(j-9)
         }else{
           doubleCheckDigits.push(j)
         };
       };


       doubleCheckDigits.push(digitsNewArray[digitsNewArray.length-1]);
        console.log(doubleCheckDigits)
       //geting the sum

       const sumOfDigits=doubleCheckDigits.reduce((acc,currentNumber)=>acc+currentNumber);
       if (sumOfDigits%10==0){
         return true;
       }else{
         return false;
       }

     };

     const validateCardNumber=()=>{
       //gather all inputs
       let inputOne=document.querySelector('[data-cc-digits]>input').value;
       let inputTwo=document.querySelector("[data-cc-digits] input:nth-child(2)").value;
       let inputThree=document.querySelector('[data-cc-digits] input:nth-child(3)').value;
       let inputFour=document.querySelector("[data-cc-digits] input:nth-child(4)").value;

       const arrayOfInputs=[inputOne+inputTwo+inputThree+inputFour];

       const digitsResult=validateWithLun(arrayOfInputs);
       if (digitsResult){
         document.querySelector('[data-cc-digits]').classList.remove('is-invalid');
         return true;
       }else{
         document.querySelector('[data-cc-digits]').classList.add("is-invalid")
       }

     };

     const uiCanInteract = () => {
       let first_input=document.querySelector('[data-cc-digits]>input');
       first_input.addEventListener('blur',detectCardType,false);


       let firstInput=document.querySelector("[data-cc-info]>input");

       firstInput.addEventListener('blur',validateCardHolderName,false);

       let date=document.querySelector("[data-cc-info] input:nth-child(2)");
       date.addEventListener("blur",validateCardExpiryDate,false);


       let button=document.querySelector('[data-pay-btn]');
       button.addEventListener('click',validateCardNumber,false)

       first_input.focus();

     };

     const displayCartTotal=({results})=>{

       const [data]=results;
       const {itemsInCart,buyerCountry}=data;
       appState.items=itemsInCart;
       appState.country=buyerCountry;
       appState.bill=itemsInCart.reduce((total,currentVal)=>total+(currentVal.price*currentVal.qty),0);


       appState.billFormated=formatAsMoney(appState.bill,appState.country);


       const dataBill=document.querySelector("[data-bill]");
       dataBill.textContent=appState.billFormated;


       uiCanInteract();

     };


     //api call

     const fetchBill=()=>{
       const api="https://randomapi.com/api/006b08a801d82d0c9824dcfdfdfa3b3c";
       fetch(api).then(
         response=>{
         return response.json();
       }).then(
         data=>{
           displayCartTotal(data);
         },
         error=>console.log("Error: ",error)

       );


     };

     const startApp=()=>{
       fetchBill();
     };

     startApp();
