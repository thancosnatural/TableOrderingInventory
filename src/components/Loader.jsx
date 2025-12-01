import { Loader2 } from "lucide-react"

// export const ButtonLoader = () => {
//     return (
//         <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> Loading...
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
//         </svg>
//     )
// }


export const ButtonLoader = () => {
    return (
        <div className="flex justify-center items-center text-black-500">
            <Loader2 className="animate-spin mr-2" /> Submitting...
        </div>
    )
}

export const Loader = () => {
    return (
        <div className="flex justify-center items-center py-20 text-blue-500">
            <Loader2 className="animate-spin mr-2" /> Loading...
        </div>
    )
}
