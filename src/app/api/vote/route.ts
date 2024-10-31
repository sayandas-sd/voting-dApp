import { ActionGetResponse, ACTIONS_CORS_HEADERS } from "@solana/actions"


export const OPTIONS = GET;

export async function GET(request: Request) {

    const actionMetadata: ActionGetResponse = {
        icon: "https://img.freepik.com/premium-photo/sleek-modern-sports-car-with-sense-speed-power_902820-1111.jpg",
        title: "Choose your favorite car",
        description: "Choose between Toyota Supra and Dodge",
        label: "Vote",
        links: {
            actions: [
                {
                    href: "/api/vote?candidate=supra",
                    label: "vote for Toyota Supra",
                    type: "transaction"
                },{
                    href: "/api/vote?candidate=dodge",
                    label: "vote for Dodge Challenger",
                    type: "transaction"
                }
            ]
        }
    };  

    return Response.json(actionMetadata, { headers: ACTIONS_CORS_HEADERS });
}
  