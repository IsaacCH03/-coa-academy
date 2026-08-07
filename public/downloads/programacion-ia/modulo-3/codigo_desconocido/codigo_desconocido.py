def procesar(rs):
    t = 0
    n = 0

    for r in rs:
        if not r["activo"]:
            continue
        if r["horas"] <= 0 or r["tarifa"] < 0:
            continue

        x = r["horas"] * r["tarifa"]

        if r["categoria"] == "urgente":
            x += x * 0.25

        if r["horas"] >= 10:
            x -= x * 0.10

        r["procesado"] = True
        t += x
        n += 1

    return {
        "procesados": n,
        "total": round(t, 2),
        "promedio": round(t / n, 2) if n else 0,
    }

