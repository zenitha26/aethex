// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req: Request) => {
    const { type, brand } = await req.json();

    const templates: any = {
        shipping: {
            title: "Shipping Policy",
            sections: [
                {
                    heading: "Free Shipping",
                    body: `${brand} offers free islandwide shipping in Sri Lanka.`
                },
                {
                    heading: "Delivery Time",
                    body: "Orders take 12–15 business days to arrive."
                }
            ]
        },

        refund: {
            title: "Refund & Replacement Policy",
            sections: [
                {
                    heading: "AETHEX Guarantee",
                    body: "We provide replacements or refunds without return requirement."
                },
                {
                    heading: "Proof Requirement",
                    body: "Unboxing video is required within 48 hours."
                }
            ]
        },

        terms: {
            title: "Terms of Service",
            sections: [
                {
                    heading: "Usage Terms",
                    body: "Customers agree to fair usage and accurate information."
                }
            ]
        }
    };

    const policy = templates[type];

    const { data, error } = await supabase
        .from("policies")
        .insert({
            type,
            title: policy.title,
            content: policy,
            is_active: true
        })
        .select()
        .single();

    if (error) {
        return new Response(JSON.stringify({ error }), { status: 500 });
    }

    return Response.json({ success: true, policy: data });
});