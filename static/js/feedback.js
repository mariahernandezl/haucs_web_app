function populate(s1,s2){
    var s1 = document.getElementById(s1);
    var s2 = document.getElementById(s2);
    s2.innerHTML=''

    if(s1.value == "do"){
        optionArray=[]
        for (var i=1; i<=70; i++){
            optionArray.push(i);
        }
    }

    for (var option in optionArray){
        var newOption = document.createElement("option");
        newOption.value = optionArray[option]
        newOption.innerHTML = option[option]
        s2.options.add(newOption);
    }
}