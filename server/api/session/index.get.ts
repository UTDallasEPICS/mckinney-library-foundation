import { auth } from "~/lib/auth";
export default  defineEventHandler( async (event)=>{
    const session = await auth.api.getSession({
      headers: event.headers
    });
   if(session) {
       return session;
   }
   return {
        seesion:null,
        user:null
   }
});