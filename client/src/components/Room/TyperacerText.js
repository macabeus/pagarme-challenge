import React from 'react';

function TyperacerText(props) {
  const textArray = props.text.split(' ');

  // Get typed words
  const textTyped = textArray
    .slice(0, props.wordsTypedCount)
    .join(' ');

  // Get *not* typed words
  let wrongTypedWord;
  let textNotTyped;
  if (props.lastWordIsIncorrect === true) {
    wrongTypedWord = textArray[props.wordsTypedCount];

    textNotTyped = textArray
      .slice(props.wordsTypedCount + 1, textArray.length)
      .join(' ');
  } else {
    textNotTyped = textArray
      .slice(props.wordsTypedCount, textArray.length)
      .join(' ');
  }

  //
  return (
    <p>
      <strong>{textTyped}</strong> <span style={{color: 'red'}}>{wrongTypedWord}</span> {textNotTyped}
    </p>
  );
}

export default TyperacerText;