import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const useFetchScreeningTypes = () => {
    const [filterData, setFilterData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const screeningTypes = collection(db, "screening_type");
                const screeningTypesGet = await getDocs(screeningTypes);

                const screeningTypesValue = collection(db, "screening_type_value");
                const screeningTypesValueGet = await getDocs(screeningTypesValue);

                const screeningTypesValueGetMain = [];
                screeningTypesValueGet.forEach((docs) => {
                    screeningTypesValueGetMain.push(docs.data());
                });

                const screeningTypesGetMain = [];
                screeningTypesGet.forEach((docs) => {
                    const data = docs.data();
                    let addScreenTypeAndValue = screeningTypesValueGetMain.filter(
                        (item) => item.screening_type_id === data.type_id
                    );
                    screeningTypesGetMain.push({ data, addScreenTypeAndValue });
                });

                setFilterData(screeningTypesGetMain);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (!filterData) { // Agar data allaqachon yuklangan bo'lsa, qayta yuklanmaydi
            fetchData();
        }
    }, [filterData]);

    return { filterData, loading };
};

export default useFetchScreeningTypes;
