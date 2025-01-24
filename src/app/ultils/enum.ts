enum projectType {
  HUMAN = "Human",
  NON_HUMAN = "non-Human",
  COVID = "Emergency",
}

enum projectStatus {
  ACTIVE = "อยู่ระหว่างปรับปรุงแแก้ไข",
  CLOSE = "ผ่านการรับรอง",
  TERMINATE = "ไม่อนุมัติ",
}

enum considerType {
  FULLBOARD = "Full Board Type",
  EXPEDITE = "Expedite Type",
}

export { projectType, projectStatus, considerType };
