import connectToDatabase from "@/app/lib/mongoose";
import Product from "@/app/models/Product";

export async function GET(req, { params }){
    const {id} = await params;
    console.log(id);
    await connectToDatabase();
    const product = await Product.findById(id);
    return product ? Response.json(product) : Response.json({ message: 'Producto no encontrado'}, {status: 404});

}

export async function PATCH(req, { params }){
    const {id} = await params;
    await connectToDatabase();
    const body = await req.json();
    const product = await Product.findByIdAndUpdate(id, body, {new: true});
    return Response.json(product);
}

export async function DELETE(req, { params }) {
    const {id} = await params;
    await connectToDatabase();
    await Product.findByIdAndDelete(id);
    return Response.json({message: 'Producto eliminado con éxito'});
}