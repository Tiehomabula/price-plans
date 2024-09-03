

  export function totalPhoneBill (phoneString, callPrice, smsPrice) {
    const phoneStringList = phoneString.split(', ');
    let total=0;
    
    for(let i=0; i<phoneStringList.length; i++) {
      const actions = phoneStringList[i];
      if(actions.includes('call')) {
        total += callPrice
      } else {
     total += smsPrice;
      }
    }
    return 'R' + total.toFixed(2);
  }
