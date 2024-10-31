import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS } from "@solana/actions"
import { Connection, PublicKey } from "@solana/web3.js";


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


export async function POST(request: Request) {
    const url = new URL(request.url);
    const candidate = url.searchParams.get("candidate");

    if(candidate != "supra" && candidate != "dodge") {

        return new Response("Invalid candidate", {
            status: 400,
            headers: ACTIONS_CORS_HEADERS
        })

    }

    const connection = new Connection("http://127.0.0.1:8899", "confirmed");

    const body: ActionPostRequest = await request.json();

    let voter;

    try{
        voter = new PublicKey(body.account);
    } catch(e) {
        return new Response("Invalid candidate", {
            status: 400,
            headers: ACTIONS_CORS_HEADERS
        })
    }



}
  