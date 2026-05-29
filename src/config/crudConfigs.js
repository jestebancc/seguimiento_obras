export const proyectosConfig = {
  title: "Proyectos Constructivos",
  endpoint: "https://keeping-murray-wage-attraction.trycloudflare.com/webhook-test/proyectos",
  columns: [
    { key: "name", label: "Obra / Proyecto" },
    { key: "category", label: "Categoría" },
    { key: "budget", label: "Presupuesto", type: "currency" },
    { key: "status", label: "Estado", type: "badge" }
  ],
  fields: [
    { name: "name", label: "Nombre del Proyecto", type: "text", required: true },
    { name: "description", label: "Descripción / Alcance", type: "textarea" },
    { 
      name: "category", 
      label: "Categoría", 
      type: "select", 
      options: [
        { label: "Residencial", value: "Residencial" },
        { label: "Comercial", value: "Comercial" },
        { label: "Industrial", value: "Industrial" },
        { label: "Infraestructura", value: "Infraestructura" }
      ],
      required: true
    },
    { name: "budget", label: "Presupuesto Estimado (S/.)", type: "number", required: true },
    { name: "startDate", label: "Fecha de Inicio", type: "date", required: true },
    { name: "endDate", label: "Fecha Límite", type: "date", required: true },
    { 
      name: "collaborators", 
      label: "Equipo Asignado", 
      type: "multiselect", 
      optionsEndpoint: "https://keeping-murray-wage-attraction.trycloudflare.com/webhook-test/usuarios-cliente",
      optionLabel: "name",
      optionValue: "id"
    },
    {
      name: "status",
      label: "Estado",
      type: "select",
      options: [
        { label: "Planificación", value: "planificacion" },
        { label: "En Progreso", value: "progreso" },
        { label: "Completado", value: "completado" },
        { label: "Pausado", value: "pausado" }
      ]
    }
  ]
};

export const colaboradoresConfig = {
  title: "Equipo Colaborador",
  endpoint: "https://keeping-murray-wage-attraction.trycloudflare.com/webhook-test/usuarios-cliente",
  columns: [
    { key: "name", label: "Nombre" },
    { key: "role", label: "Cargo" },
    { key: "email", label: "Email" },
    { key: "status", label: "Estado", type: "badge" }
  ],
  fields: [
    { name: "name", label: "Nombre Completo", type: "text", required: true },
    { 
      name: "role", 
      label: "Cargo / Especialidad", 
      type: "select", 
      options: [
        { label: "Arquitecto Principal", value: "Arquitecto Principal" },
        { label: "Ingeniero Civil", value: "Ingeniero Civil" },
        { label: "Diseñador de Interiores", value: "Diseñador de Interiores" },
        { label: "Supervisor de Obra", value: "Supervisor de Obra" },
        { label: "Electricista Principal", value: "Electricista Principal" },
        { label: "Especialista BIM", value: "Especialista BIM" },
        { label: "Topógrafo", value: "Topógrafo" },
        { label: "Maestro de Obra", value: "Maestro de Obra" }
      ],
      required: true
    },
    { name: "email", label: "Correo Electrónico", type: "email", required: true },
    { name: "phone", label: "Teléfono Celular", type: "text" },
    { 
      name: "status", 
      label: "Estado de Actividad", 
      type: "radio", 
      options: [
        { label: "Activo", value: "activo" },
        { label: "Inactivo", value: "inactivo" }
      ],
      required: true
    }
  ]
};

export const seguimientosConfig = {
  title: "Bitácora de Seguimientos",
  // No endpoint existed for this, using local storage mocked in ComponenteCrud or a placeholder
  endpoint: "local://seguimientos", 
  columns: [
    { key: "projectId", label: "Proyecto", type: "foreign", foreignEndpoint: "https://keeping-murray-wage-attraction.trycloudflare.com/webhook-test/proyectos", foreignLabel: "name" },
    { key: "date", label: "Fecha", type: "date" },
    { key: "progress", label: "Avance %", type: "progress" },
    { key: "status", label: "Estado", type: "badge" }
  ],
  fields: [
    { 
      name: "projectId", 
      label: "Proyecto Relacionado", 
      type: "select", 
      optionsEndpoint: "https://keeping-murray-wage-attraction.trycloudflare.com/webhook-test/proyectos",
      optionLabel: "name",
      optionValue: "id",
      required: true
    },
    { name: "date", label: "Fecha de Reporte", type: "date", required: true },
    { name: "description", label: "Descripción de Avances", type: "textarea", required: true },
    { name: "progress", label: "Porcentaje de Avance Físico (%)", type: "number", required: true },
    { name: "budgetSpent", label: "Presupuesto Ejecutado (S/.)", type: "number" },
    { 
      name: "collaboratorId", 
      label: "Supervisor Responsable", 
      type: "select", 
      optionsEndpoint: "https://keeping-murray-wage-attraction.trycloudflare.com/webhook-test/usuarios-cliente",
      optionLabel: "name",
      optionValue: "id",
      required: true
    },
    { 
      name: "status", 
      label: "Estado Actual", 
      type: "select", 
      options: [
        { label: "Al Día (Normal)", value: "normal" },
        { label: "Con Retraso", value: "retraso" },
        { label: "Crítico", value: "critico" }
      ],
      required: true
    }
  ]
};
