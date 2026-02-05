import { auth } from "~/lib/auth";
export default  defineEventHandler( async (event)=>{
  try{
    const session = await auth.api.getSession({
      headers: event.headers
    });

    // console.log("session",session)
    return{
      success: true,
      statusCode: 200,
      data: session
    }
  }catch (error) {
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to fetch session",
            error: error, 
            data: null
        }
    } 
});