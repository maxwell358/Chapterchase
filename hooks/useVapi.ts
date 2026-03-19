'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { IBook, Messages } from '@/types';
import { ASSISTANT_ID } from '@/lib/constants';
import { getVoice } from '@/lib/utils';

export default function useVapi(book: IBook) {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'starting' | 'listening' | 'thinking' | 'speaking'>('idle');
    const [isActive, setIsActive] = useState(false);
    const [messages, setMessages] = useState<Messages[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [currentUserMessage, setCurrentUserMessage] = useState('');
    const [duration, setDuration] = useState(0);
    const [limitError, setLimitError] = useState<string | null>(null);
    const [isBillingError, setIsBillingError] = useState(false);
    const maxDurationSeconds = 3600; // 1 hour for now

    const start = useCallback(() => {
        setIsActive(true);
        setStatus('connecting');
        // Simulated start
        setTimeout(() => setStatus('listening'), 1000);
    }, []);

    const stop = useCallback(() => {
        setIsActive(false);
        setStatus('idle');
    }, []);

    const clearError = useCallback(() => {
        setLimitError(null);
        setIsBillingError(false);
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive) {
            timer = setInterval(() => {
                setDuration(d => d + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isActive]);

    return {
        status,
        isActive,
        messages,
        currentMessage,
        currentUserMessage,
        duration,
        start,
        stop,
        clearError,
        limitError,
        isBillingError,
        maxDurationSeconds,
    };
}
