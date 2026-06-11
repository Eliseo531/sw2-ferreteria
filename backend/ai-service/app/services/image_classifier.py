def classify_product(filename: str):
    filename_lower = filename.lower()

    if "martillo" in filename_lower:
        return {
            "product": "Martillo",
            "category": "Herramientas",
            "confidence": 0.96
        }

    if "taladro" in filename_lower:
        return {
            "product": "Taladro",
            "category": "Herramientas eléctricas",
            "confidence": 0.94
        }

    if "destornillador" in filename_lower:
        return {
            "product": "Destornillador",
            "category": "Herramientas",
            "confidence": 0.93
        }

    if "pala" in filename_lower:
        return {
            "product": "Pala",
            "category": "Construcción",
            "confidence": 0.91
        }

    if "cemento" in filename_lower:
        return {
            "product": "Cemento",
            "category": "Construcción",
            "confidence": 0.95
        }

    if "pintura" in filename_lower:
        return {
            "product": "Pintura",
            "category": "Pinturas",
            "confidence": 0.92
        }

    return {
        "product": "Producto no identificado",
        "category": "Desconocido",
        "confidence": 0.50
    }