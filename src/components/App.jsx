import { useEffect, useReducer } from 'react'
import DateCounter from './DateCounter.jsx'
import Header from './Header.jsx'
import Main from './Main_.jsx'
import Loader from './Loader.jsx'
import Error from './Error.jsx'
import StartScreen from './StartScreen.jsx'
import Question from './Question.jsx'
import NextButton from './NextButton.jsx'
import Progress from './Progress.jsx'
import FinishedScreen from './FinishedScreen.jsx'
import Footer from './Footer.jsx'
import Timer from './Timer.jsx'


const SECS_PER_QUESTION = 30;
const initialState = {
    questions: [],
    //loading, error, ready, active, finished
    status: 'loading',
    index: 0,
    answer: null,
    points: 0,
    highscore: 0,
    secondsRemaining: null,
}
function reducer(state, action) {
    switch (action.type) {
        case 'dataReceived':
            return {
                ...state,
                questions: action.payload, status: 'ready'
            }

        case 'dataFailed':
            return {
                ...state,
                status: 'error'
            }
        case 'start':
            return {
                ...state,
                status: 'active',
                secondsRemaining: state.questions.length * SECS_PER_QUESTION
            }
        case 'newAnswer':
            const question = state.questions.at(state.index);

            return {
                ...state,
                answer: action.payload,
                points: action.payload === question.correctOption ? state.points + question.points : state.points
            }
        case 'nextQuestion':
            return {
                ...state,
                index: state.index + 1,
                answer: null
            }
        case 'finish':
            return { ...state, status: 'finished', highscore: state.points > state.highscore ? state.points : state.highscore }
        case 'restart':

            return { ...initialState, questions: state.questions, status: "ready" }

        case 'tick':
            return {
                ...state,
                secondsRemaining: state.secondsRemaining - 1,
                status: state.secondsRemaining === 0
                    ?
                    'finished'
                    :
                    state.status
            }
        default: throw new Error('Unknown Action')
    }
}

export default function App() {

    const [{ questions, status, index, answer, points, highscore, secondsRemaining }, dispatch] = useReducer(reducer, initialState);

    const numQuestions = questions.length;
    const maxPossiblePoints = questions.reduce((prev, curr) => prev + curr.points, 0)

    useEffect(function () {
        fetch('https://react-quiz-nikk.onrender.com/questions')
            .then((res) => res.json())
            .then(data => dispatch({ type: 'dataReceived', payload: data })).catch(err => dispatch({ type: 'dataFailed' }))
    }, [])
    return <div className='app'>
        <Header />
        <Main>
            {status === 'loading' && <Loader />}
            {status === 'error' && <Error />}
            {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
            {status === 'active' &&
                <>
                    <Progress
                        index={index}
                        numQuestions={numQuestions}
                        points={points}
                        maxPossiblePoints={maxPossiblePoints}
                        answer={answer} />

                    <Question
                        question={questions[index]}
                        dispatch={dispatch}
                        answer={answer} />
                    <Footer>
                        <Timer
                            dispatch={dispatch}
                            secondsRemaining={secondsRemaining} />
                        <NextButton
                            dispatch={dispatch}
                            answer={answer}
                            index={index}
                            numQuestions={numQuestions} />
                    </Footer>



                </>
            }
            {status === 'finished' && <FinishedScreen
                points={points}
                maxPossiblePoints={maxPossiblePoints}
                highscore={highscore}
                dispatch={dispatch} />}
        </Main>
    </div>
}