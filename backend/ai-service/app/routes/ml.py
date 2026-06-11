from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans
router = APIRouter()


class DemandPredictionRequest(BaseModel):
    product_name: str
    sales_history: List[int]


@router.post("/predict-demand")
def predict_demand(request: DemandPredictionRequest):
    sales = request.sales_history

    if len(sales) < 3:
        raise HTTPException(
            status_code=400,
            detail="Se necesitan al menos 3 registros históricos de ventas",
        )

    # X representa los periodos: semana 1, semana 2, semana 3...
    X = np.array(range(1, len(sales) + 1)).reshape(-1, 1)

    # y representa las ventas de cada periodo
    y = np.array(sales)

    model = LinearRegression()
    model.fit(X, y)

    next_period = np.array([[len(sales) + 1]])
    predicted_demand = model.predict(next_period)[0]

    predicted_demand = max(0, round(predicted_demand))

    if predicted_demand >= max(sales):
        recommendation = "Alta demanda esperada. Se recomienda revisar stock."
    elif predicted_demand <= min(sales):
        recommendation = "Demanda baja esperada. No se recomienda sobrecomprar."
    else:
        recommendation = "Demanda estable. Mantener control normal de inventario."

    return {
        "product_name": request.product_name,
        "sales_history": sales,
        "predicted_demand": predicted_demand,
        "algorithm": "Linear Regression",
        "ml_type": "Supervised Learning",
        "recommendation": recommendation,
    }
    
class ProductClusterItem(BaseModel):
    product_name: str
    monthly_sales: int
    current_stock: int
    stock_rotation: float


class ProductClusterRequest(BaseModel):
    products: List[ProductClusterItem]


@router.post("/cluster-products")
def cluster_products(request: ProductClusterRequest):
    products = request.products

    if len(products) < 3:
        raise HTTPException(
            status_code=400,
            detail="Se necesitan al menos 3 productos para generar clusters",
        )

    data = np.array([
        [
            product.monthly_sales,
            product.current_stock,
            product.stock_rotation,
        ]
        for product in products
    ])

    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(data)

    results = []

    for index, product in enumerate(products):
        cluster = int(clusters[index])

        if product.monthly_sales >= 100 or product.stock_rotation >= 0.70:
            category = "ALTA_ROTACION"
        elif product.monthly_sales >= 40 or product.stock_rotation >= 0.35:
            category = "MEDIA_ROTACION"
        else:
            category = "BAJA_ROTACION"

        results.append({
            "product_name": product.product_name,
            "monthly_sales": product.monthly_sales,
            "current_stock": product.current_stock,
            "stock_rotation": product.stock_rotation,
            "cluster": cluster,
            "category": category,
        })

    return {
        "algorithm": "KMeans",
        "ml_type": "Unsupervised Learning",
        "clusters_generated": 3,
        "products": results,
    }
    
    
class RestockRecommendationRequest(BaseModel):
    product_name: str
    current_stock: int
    predicted_demand: int
    category: str


@router.post("/recommend-restock")
def recommend_restock(request: RestockRecommendationRequest):
    stock = request.current_stock
    demand = request.predicted_demand
    category = request.category.upper()

    actions = {
        "NO_COMPRAR": 0,
        "COMPRAR_POCO": 20,
        "COMPRAR_MEDIO": 50,
        "COMPRAR_MUCHO": 100,
    }

    rewards = {}

    for action, quantity in actions.items():
        projected_stock = stock + quantity

        if projected_stock < demand:
            reward = -10
        elif projected_stock > demand * 2:
            reward = -5
        else:
            reward = 10

        if category == "ALTA_ROTACION" and action in ["COMPRAR_MEDIO", "COMPRAR_MUCHO"]:
            reward += 5

        if category == "BAJA_ROTACION" and action in ["COMPRAR_MUCHO"]:
            reward -= 5

        rewards[action] = reward

    best_action = max(rewards, key=rewards.get)
    quantity_to_buy = actions[best_action]

    if best_action == "NO_COMPRAR":
        message = "No se recomienda realizar reposición por el momento."
    elif best_action == "COMPRAR_POCO":
        message = "Se recomienda una reposición pequeña para evitar exceso de stock."
    elif best_action == "COMPRAR_MEDIO":
        message = "Se recomienda una reposición moderada para cubrir la demanda esperada."
    else:
        message = "Se recomienda una reposición alta por la demanda esperada y rotación del producto."

    return {
        "product_name": request.product_name,
        "ml_type": "Reinforcement Learning",
        "state": {
            "current_stock": stock,
            "predicted_demand": demand,
            "category": category,
        },
        "actions": actions,
        "rewards": rewards,
        "recommended_action": best_action,
        "quantity_to_buy": quantity_to_buy,
        "message": message,
    }
    
class InventoryProductInput(BaseModel):
    product_name: str
    current_stock: int
    stock_minimum: int
    monthly_sales: int
    stock_rotation: float
    sales_history: List[int]


class InventoryAnalysisRequest(BaseModel):
    products: List[InventoryProductInput]


@router.post("/analyze-inventory")
def analyze_inventory(request: InventoryAnalysisRequest):
    results = []

    for product in request.products:
        if len(product.sales_history) < 3:
            continue

        # 1. ML Supervisado: predicción de demanda
        X = np.array(range(1, len(product.sales_history) + 1)).reshape(-1, 1)
        y = np.array(product.sales_history)

        model = LinearRegression()
        model.fit(X, y)

        next_period = np.array([[len(product.sales_history) + 1]])
        predicted_demand = max(0, round(model.predict(next_period)[0]))

        # 2. ML No Supervisado simplificado: clasificación por rotación
        if product.monthly_sales >= 100 or product.stock_rotation >= 0.70:
            category = "ALTA_ROTACION"
        elif product.monthly_sales >= 40 or product.stock_rotation >= 0.35:
            category = "MEDIA_ROTACION"
        else:
            category = "BAJA_ROTACION"

        # 3. Refuerzo: decisión de reposición
        actions = {
            "NO_COMPRAR": 0,
            "COMPRAR_POCO": 20,
            "COMPRAR_MEDIO": 50,
            "COMPRAR_MUCHO": 100,
        }

        rewards = {}

        for action, quantity in actions.items():
            projected_stock = product.current_stock + quantity

            if projected_stock < predicted_demand:
                reward = -10
            elif projected_stock > predicted_demand * 2:
                reward = -5
            else:
                reward = 10

            if category == "ALTA_ROTACION" and action in ["COMPRAR_MEDIO", "COMPRAR_MUCHO"]:
                reward += 5

            if category == "BAJA_ROTACION" and action == "COMPRAR_MUCHO":
                reward -= 5

            rewards[action] = reward

        best_action = max(rewards, key=rewards.get)
        quantity_to_buy = actions[best_action]

        # Prioridad
        if (
            product.current_stock <= product.stock_minimum
            or product.current_stock < predicted_demand
            or (category == "ALTA_ROTACION" and product.current_stock < predicted_demand * 1.5)
        ):
            priority = "ALTA"
        elif product.current_stock <= predicted_demand * 1.5:
            priority = "MEDIA"
        else:
            priority = "BAJA"

        results.append({
            "product_name": product.product_name,
            "current_stock": product.current_stock,
            "stock_minimum": product.stock_minimum,
            "monthly_sales": product.monthly_sales,
            "stock_rotation": product.stock_rotation,
            "predicted_demand": predicted_demand,
            "category": category,
            "recommended_action": best_action,
            "quantity_to_buy": quantity_to_buy,
            "priority": priority,
            "rewards": rewards,
        })

    critical_products = [
        item for item in results
        if item["priority"] in ["ALTA", "MEDIA"]
    ]

    return {
        "ml_types": [
            "Supervised Learning",
            "Unsupervised Learning",
            "Reinforcement Learning"
        ],
        "total_products_analyzed": len(results),
        "critical_products": len([
            item for item in results if item["priority"] == "ALTA"
        ]),
        "recommended_restock": len([
            item for item in results if item["recommended_action"] != "NO_COMPRAR"
        ]),
        "products": critical_products,
    }