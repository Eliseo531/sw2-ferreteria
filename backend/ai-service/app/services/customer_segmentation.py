def segment_customer(customer_id: int):
    customers_data = {
        1: {
            "customer_name": "Juan Pérez",
            "purchase_frequency": 8,
            "monthly_spending": 2500,
            "main_category": "Construcción"
        },
        2: {
            "customer_name": "Constructora Alfa",
            "purchase_frequency": 20,
            "monthly_spending": 15000,
            "main_category": "Construcción"
        },
        3: {
            "customer_name": "Carlos Rojas",
            "purchase_frequency": 5,
            "monthly_spending": 1200,
            "main_category": "Electricidad"
        },
        4: {
            "customer_name": "Ferretería Vecina",
            "purchase_frequency": 15,
            "monthly_spending": 8000,
            "main_category": "Herramientas"
        },
        5: {
            "customer_name": "Cliente ocasional",
            "purchase_frequency": 1,
            "monthly_spending": 150,
            "main_category": "General"
        }
    }

    customer = customers_data.get(customer_id)

    if not customer:
        return {
            "customer_id": customer_id,
            "segment": "DESCONOCIDO",
            "message": "No existen datos suficientes para segmentar al cliente."
        }

    spending = customer["monthly_spending"]
    frequency = customer["purchase_frequency"]

    if spending >= 10000 and frequency >= 15:
        segment = "MAYORISTA"
        recommendation = "Ofrecer descuentos por volumen y atención preferencial."
    elif spending >= 5000 and frequency >= 10:
        segment = "CONSTRUCTOR_FRECUENTE"
        recommendation = "Ofrecer paquetes de materiales de construcción."
    elif customer["main_category"] == "Electricidad":
        segment = "ELECTRICISTA"
        recommendation = "Ofrecer promociones en cables, tomacorrientes y herramientas eléctricas."
    elif frequency <= 2:
        segment = "OCASIONAL"
        recommendation = "Enviar promociones generales para incentivar nuevas compras."
    else:
        segment = "MINORISTA"
        recommendation = "Mantener promociones básicas y seguimiento comercial."

    return {
        "customer_id": customer_id,
        "customer_name": customer["customer_name"],
        "purchase_frequency": frequency,
        "monthly_spending": spending,
        "main_category": customer["main_category"],
        "segment": segment,
        "recommendation": recommendation
    }