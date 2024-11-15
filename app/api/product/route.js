import connectToDatabase from "@/app/lib/mongoose";
import Product from "@/app/models/Product";
import { revalidateTag } from "next/cache";

export async function GET() {
    await connectToDatabase();
    const products = await Product.find();
    return Response.json(products, {headers: {'Cache-Control': 'no-cache'}});
};

export async function POST(req) {
    try{
        await connectToDatabase();
        const body = await req.json();
        const product = new Product(body);
        await product.save();

        revalidateTag("products-list");

        return Response.json(product, { status: 201 });
    }catch(error){
        return new Response(error.message);
    }
    
  }