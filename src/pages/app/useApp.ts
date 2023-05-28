import React, { useEffect } from "react";
import { useCollection } from '../../hooks/useCollection'

type Props = {};
export const useApp = (props: Props) => {
  // custom hook
  const {  fetchCollectionById } = useCollection({})

    useEffect(() => {

        const url = window.location.search;
        const id = url.split("id=")[1];

        fetchCollectionById(id);
    }, []);

    return {

    }
}