import {useEffect, useRef} from "react";

export const useDidMountEffect = function(fn: () => void, inputs: any[]) {
    const didMountRef = useRef(false);

    useEffect(() => {
        if (didMountRef.current)
            fn();
        else
            didMountRef.current = true;
    }, inputs);
};