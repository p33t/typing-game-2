import {useAppSelector} from "../../app/hooks";

export default function MainPage() {
    
    const config =  useAppSelector((state) => state.config);
    
    return <p>Main Page: {config.keySetName}</p>;
}