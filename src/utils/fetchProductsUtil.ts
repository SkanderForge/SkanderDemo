import axios from 'axios';
import {ApiEndpoint} from "@/constants";
import {Products} from "@/utils/types";

/**
 * Used for ProductsList. This function fetches
 * a list of products from the endpoint, as defined
 * in constants.ts.
 * TODO:
 * Ideally we'd loop through each product, and obtain
 * the dimensions of its thumbnail from the remote source
 * for the purposes of being able to input it later on in next.js's
 * <Image>, but there doesn't seem to be an easy way to do it.
 */
async function fetchProductsUtil(): Promise<Products> {
    try {
        const res = await axios.get<Products>(ApiEndpoint);
        return res.data.map((product) => ({
            ...product,
            rating: Math.ceil(+product.rating / 2),
        }));
    } catch (error) {
        console.log("Error in fetching products: ", error);
        throw error;
    }
}

export default fetchProductsUtil;