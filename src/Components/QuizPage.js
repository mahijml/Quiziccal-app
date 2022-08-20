import React, { useEffect, useState } from 'react'

function QuizPage() {
    const [quizes, setQuizes] = useState([]);
    const [userAnswer, setUserAnswer] = useState([]);
    const [submited ,setSubmited] = useState(false)
    const [loading ,setLoading] = useState(false);
    const [correctAnswers , setCorrectAnswers] = useState(0);
    const [submitError , setSubmitError] = useState(false);
    const wholeTime = 60; //seconds
    const [remainingTime , setRemainingTime] = useState(wholeTime);
    const [GameOver, setGameOver] = useState(false);

    useEffect(()=>{
        const fetchingQuestions = async() => {
            await fetch('https://opentdb.com/api.php?amount=5&category=9&type=multiple')
            .then(res => res.json())
            .then(data => {
                setCorrectAnswers(0);
                const formatQuestions = data.results.map((question,i)=> {
                    //// create options with random placement
                    const randomNum = Math.floor(Math.random() * 4);
                    const choice = [...question.incorrect_answers]
                    choice.splice(randomNum,0,question.correct_answer).join();
                    const newChoices = choice.map(ch=> {
                        return {
                            option : ch,
                            isSelected: false
                        }
                    })
                    return {title : question.question ,
                            choices : newChoices ,
                            id: i , 
                            correctAnswer : randomNum,
                            }
                    })
                    console.log(formatQuestions);
                    setQuizes(formatQuestions);
                    setUserAnswer(formatQuestions);
                    setLoading(true)
                  
            }) 
            }
        !submited && fetchingQuestions(); 

        
    },[submited])

    useEffect(()=>{
        let timer;
        if(loading) {
            timer = setTimeout(()=>{
                if(!submited && remainingTime > 0) {
                    setRemainingTime(prevTime => prevTime - 1);
                }else if(!submited){
                    setGameOver(true);
                }
                
            },1000)
        }

        return ()=>{
            clearTimeout(timer);
        }
    },[remainingTime,submited,loading])

    //after click every options
    const selectedAnswer = (questionId , choiceId) => {
        const answers = quizes.map(question=>{
                if(question.id === questionId){
                    const newChoices = question.choices.map((choice,i)=>{
                        if(choiceId === i) {
                            return {option: choice.option, isSelected : true}
                        }else{
                            return {option: choice.option, isSelected : false}
                        }
                    })
                    return {...question, choices: newChoices}
                }else {
                    return question
                }
                
            })
            setQuizes(answers)
    }
    //show final result
    const showResult = () => {
        setUserAnswer(quizes.map(quiz=>{
            const newChoices = quiz.choices.map((choice, index)=>{
                if(choice.isSelected ){
                    if(index === quiz.correctAnswer){
                        setCorrectAnswers(prevCorrectAnswer=> prevCorrectAnswer + 1)
                        return {
                            checked : 'correct',
                            option : choice.option
                        }
                    }else {
                        return {
                            checked : 'wrong',
                            option : choice.option
                        }
                    }
                }else {
                    if(index === quiz.correctAnswer){
                        return {
                            checked : 'correct',
                            option : choice.option
                        }
                    }else {
                        return {
                            checked : 'unSelected',
                            option : choice.option
                        }
                    }
                }
            })
            return {...quiz, choices: newChoices}
        }))
    }
    const submitChecking  = () => {
        //check if all the questions is answerd
        let emptyAsw = false;
        quizes.forEach(quiz=> {
            const quizChecked = quiz.choices.filter(choice => choice.isSelected)
            if(quizChecked.length === 0){
                setSubmitError(true)
                emptyAsw = true
                return
            }
        })
         !emptyAsw && endGame();
    }
    const endGame = () => {
        showResult();
        setSubmitError(false);
        setSubmited(true) 

    }
  return (
    <>
    {!loading ? (
        <h2 className='loading-txt'> Ready ?</h2>
    ): 
    <div className='container'>
    { !submited ? <div className='question'>
        <h2 className='timer'>0:{remainingTime}</h2>
        {quizes.map(q=>{
            return <div key={q.title}>

                    <h4 className='option-title'><span>{q.id +1}.</span>{q.title}</h4>
                    <div className='options'>
                    {q.choices.map((choice,i)=>{
                        return (
                            <button  
                            className={choice.isSelected ? 'option-btn selected quiz-option' :'option-btn quiz-option'}
                            onClick={()=> selectedAnswer(q.id,i)}
                            key={choice.option}
                            >
                                {choice.option}
                            </button>
                        )
                    })}
                    </div>
                    <div className='line'></div>
                </div>
        })}
        {submitError && <h3 className='submit-error'>You have to answer all the questions</h3>}

        <button className='btn' onClick={submitChecking}>Check Answers</button>
        {GameOver && endGame()}
        </div>
        :
        <>
        <div className='question'>
            {userAnswer.map(q=>{
            return<div key={q.title}>

                    <h4 className='option-title'><span>{q.id +1}.</span>{q.title}</h4>
                    <div className='options'>
                    {q.choices.map((choice,i)=>{
                        return (
                            <button disabled
                            className={`${choice.checked} option-btn`}
                            onClick={()=> selectedAnswer(q.id,i)}
                            key={choice.option}
                            >
                                {choice.option}
                            </button>
                        )
                    })}
                    </div>
                    <div className='line'></div>
                </div>
        })}
        </div>
        {GameOver && <div className='time-error'><h3>Time is up!</h3></div>}
        <div className='footer'>
        <h3>You scored {GameOver ? 0 :correctAnswers}/5 correct answerd </h3>
        <button 
        className='btn footer-btn'
            onClick={()=> {
                setSubmited(false)
                setLoading(false)
                setRemainingTime(wholeTime)
                setGameOver(false)
                }}>
            Play Again
        </button>
        </div>
    </>
}
    </div>
   }
    </>
  )
}

export default QuizPage