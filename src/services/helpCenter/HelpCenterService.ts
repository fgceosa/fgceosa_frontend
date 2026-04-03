import AxiosBase from "../axios/AxiosBase";

export const HelpCenterService = {
    getHelpCenter: async () => {
        const response = await AxiosBase.get("/help-center");
        return response.data;
    },
};
