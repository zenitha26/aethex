import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "../../../../lib/supabase";

const defaultProducts: any[] = [];

export async function GET() {
  try {
    // 1. Authorize Admin Session handled by Middleware

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database configuration error." }, { status: 500 });
    }

    // 2. Fetch all products from Supabase
    let { data: products, error: productsError } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (productsError) {
      console.error("Fetch products error:", productsError);
      return NextResponse.json({ error: "Failed to fetch products from database." }, { status: 500 });
    }

    // 3. Auto-seed default products if empty
    if (!products || products.length === 0) {
      const seedData = defaultProducts.map((p: any) => ({
        title: p.title,
        description: p.description,
        price: p.price,
        original_price: p.original_price,
        image_url: p.image_url,
        source: p.source || "aliexpress",
        stock: p.stock || 10,
      }));

      const { data: seededProducts, error: seedError } = await supabaseAdmin
        .from("products")
        .insert(seedData)
        .select();

      if (seedError) {
        console.error("Product seeding error:", seedError);
      } else if (seededProducts) {
        products = seededProducts;
      }
    }

    return NextResponse.json({ success: true, products });
  } catch (err) {
    console.error("Admin products GET route error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Admin auth handled by Middleware

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database configuration error." }, { status: 500 });
    }

    const { title, description, price, original_price, image_url, source, stock } = await request.json();

    if (!title || price === undefined) {
      return NextResponse.json({ error: "Missing required title or price parameters." }, { status: 400 });
    }

    const { data: newProduct, error: insertError } = await supabaseAdmin
      .from("products")
      .insert({
        title,
        description: description || null,
        price: parseFloat(price),
        original_price: original_price ? parseFloat(original_price) : null,
        image_url: image_url || "p1",
        source: source || "in-house",
        stock: stock !== undefined ? parseInt(stock, 10) : 10,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Product insert error:", insertError);
      return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    console.error("Admin products POST route error:", err);
    return NextResponse.json({ error: err.message || "An unexpected error occurred." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Admin auth handled by Middleware

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database configuration error." }, { status: 500 });
    }

    const { id, title, description, price, original_price, image_url, source, stock } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing product id." }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {};
    if (title !== undefined) updatePayload.title = title;
    if (description !== undefined) updatePayload.description = description || null;
    if (price !== undefined) updatePayload.price = parseFloat(price);
    if (original_price !== undefined) updatePayload.original_price = original_price ? parseFloat(original_price) : null;
    if (image_url !== undefined) updatePayload.image_url = image_url;
    if (source !== undefined) updatePayload.source = source;
    if (stock !== undefined) updatePayload.stock = parseInt(stock, 10);
    updatePayload.updated_at = new Date().toISOString();

    const { error: updateError } = await supabaseAdmin
      .from("products")
      .update(updatePayload)
      .eq("id", id);

    if (updateError) {
      console.error("Product update error:", updateError);
      return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin products PUT route error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Admin auth handled by Middleware

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database configuration error." }, { status: 500 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing product id." }, { status: 400 });
    }

    const { error: deleteError } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Product delete error:", deleteError);
      return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Admin products DELETE route error:", err);
    return NextResponse.json({ error: err.message || "An unexpected error occurred." }, { status: 500 });
  }
}
