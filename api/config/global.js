const RESPONSE={
    SUCCESS:{
        code:200, 
        message:"Everything worked as expected",
    },
    UNKNOW_ERROR:{
        code:500,
        message:"Something went wrong!",
    },
    REQUIRED_PARAMS:{
        code:201,
        message:"is required params",
    },

    NO_DATA:{
        code:202,
        message:"No data found",
    },
    INVALID_PARAMS:{
        code:203,
        message:"Invalid params",
    },
    EXISTING_DATA:{
        code:204,
        message:"Data already exists",
    },
    CREDENTIAL_ERROR:{
        code:205,
        message:"Login credentials does not match",
    },

    ACCESS_DENIED:{
        code:206,
        message:"Access denied",
    },
    INVALID_TOKEN:{
        code:207,
        message:"Invalid token",
    }
    
}
export default RESPONSE;