def predict_demand(product_id: int):
    products_data = {
        1: {
            "product_name": "Martillo",
            "category": "Herramientas",
            "base_demand": 35,
            "season_factor": 1.1
        },
        2: {
            "product_name": "Taladro",
            "category": "Herramientas eléctricas",
            "base_demand": 20,
            "season_factor": 1.2
        },
        3: {
            "product_name": "Cemento",
            "category": "Construcción",
            "base_demand": 120,
            "season_factor": 1.4
        },
        4: {
            "product_name": "Pintura",
            "category": "Pinturas",
            "base_demand": 80,
            "season_factor": 1.5
        },
        5: {
            "product_name": "Pala",
            "category": "Construcción",
            "base_demand": 45,
            "season_factor": 1.3
        }
    }

    product = products_data.get(product_id)

    if not product:
        return {
            "product_id": product_id,
            "product_name": "Producto desconocido",
            "category": "Desconocido",
            "base_demand": 0,
            "season_factor": 1,
            "predicted_units_next_month": 0,
            "recommendation": "No existen datos suficientes para realizar predicción."
        }

    predicted_units = int(product["base_demand"] * product["season_factor"])

    recommendation = "Demanda normal."

    if predicted_units >= 100:
        recommendation = "Alta demanda prevista. Se recomienda aumentar stock."
    elif predicted_units >= 50:
        recommendation = "Demanda media. Revisar inventario preventivamente."
    else:
        recommendation = "Demanda baja o estable."

    return {
        "product_id": product_id,
        "product_name": product["product_name"],
        "category": product["category"],
        "base_demand": product["base_demand"],
        "season_factor": product["season_factor"],
        "predicted_units_next_month": predicted_units,
        "recommendation": recommendation
    }