import React, { createContext, useContext, useState } from 'react';
import useProgress from './hooks/useProgress';

/**
 * Context for managing quiz state.
 */
const QuizContext = createContext();

/**
 * Custom hook to access the QuizContext.
 * @returns {Object} Quiz context values.
 */
export const useQuiz = () => useContext(QuizContext);

/**
 * Provides quiz-related state and functions to the application.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {JSX.Element} The QuizContext provider.
 */
export const QuizProvider = ({ children }) => {
    const [finished, setFinished] = useState(false);
    const { progress, setProgress } = useProgress();

    return (
        <QuizContext.Provider value={{ finished, setFinished, progress, setProgress }}>
            {children}
        </QuizContext.Provider>
    );
};
