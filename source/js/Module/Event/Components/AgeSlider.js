// // Frontend functionality
// const sliderFunc = () => {
//     const parent = document.querySelector('.age-input')

//     if(!parent) {
//         return;
//     }

//     const numberInput = parent.querySelectorAll('input[type="number"]');

//     numberInput.forEach((el) => {
//         el.oninput = () => {
//             let number1 = parseInt(numberInput[0].value), number2 = parseInt(numberInput[1].value);
//             if (number1 > number2) {
//                 let tmp = number1;
//                 numberInput[0].value = number2;
//                 numberInput[1].value = tmp
//             }
//         };
//     })
// };

// // ageRange will be modified then passed to FilterableEventsContainer for fetching events
// export default function AgeSlider ( { translation, ageRange } ) {
//     sliderFunc();
    
//     const onInput = () => {
//         let minValue = parseInt(document.getElementById("minValue").value);
//         let maxValue = parseInt(document.getElementById("maxValue").value);
        
//         if (minValue > maxValue) {
//             [minValue, maxValue] = [maxValue, minValue];
//         }
        
//         for (let i = 0; i < ageRange.length; i++) {
//             if (i >= (minValue - 1) && i < maxValue) {
//                 ageRange[i].checked = true;
//             }
//             else {
//                 ageRange[i].checked = false;
//             }
//         }
//     }
    
//     let toggleState = false;
//     let toggleContainer = document.querySelector('.age-slider-container');
//     let arrowUp = document.querySelector('#up-arrow');
//     let arrowDown = document.querySelector('#down-arrow');

//     const toggleAge = (e) => {
//         toggleState = !toggleState;
//         e.preventDefault();
//         if (toggleState) {
//             toggleContainer.classList.add('show');
//             arrowUp.classList.remove('hide');
//             arrowDown.classList.add('hide');
            
//         } else {
//             toggleContainer.classList.remove('show');
//             arrowUp.classList.add('hide');
//             arrowDown.classList.remove('hide');
//         }
//     }

//     return (
//         <div>
//             <button className="c-button c-button__filled c-button__filled--default c-button--md" onClick={toggleAge} >
//                 <span className="c-button__label-text">{translation.selectAge}</span>
//                 <span className="c-button__label-icon"><i id="down-arrow" class="c-icon c-icon--size-md material-icons">keyboard_arrow_down</i></span>
//                 <span className="c-button__label-icon"><i id="up-arrow" class="c-icon c-icon--size-md material-icons hide">keyboard_arrow_up</i></span>
//             </button>
//             <div className="age-slider-container u-position--absolute u-level-top">
//                     <div className="age-input" >
//                         <span>
//                             min <input type="number" defaultValue="1" min="1" max="100" step="1" onChange={onInput}/> 
//                         </span>    
//                         <span>
//                             max <input type="number" defaultValue="100" min="1" max="100" step="1" onChange={onInput} />
//                         </span>
//                     </div>
//             </div>
//         </div>
//     )
// }