function procesar(rs) {
  let t = 0;
  let n = 0;

  for (const r of rs) {
    if (!r.activo) {
      continue;
    }
    if (r.horas <= 0 || r.tarifa < 0) {
      continue;
    }

    let x = r.horas * r.tarifa;

    if (r.categoria === "urgente") {
      x += x * 0.25;
    }

    if (r.horas >= 10) {
      x -= x * 0.10;
    }

    r.procesado = true;
    t += x;
    n += 1;
  }

  return {
    procesados: n,
    total: Math.round((t + Number.EPSILON) * 100) / 100,
    promedio: n === 0 ? 0 : Math.round((t / n + Number.EPSILON) * 100) / 100,
  };
}

module.exports = { procesar };

