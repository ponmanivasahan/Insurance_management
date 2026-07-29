// Mock API Client to replace Axios server requests
// Persists all data in localStorage for persistence across reloads

const getLocalData = (key, defaultVal) => {
    const data = localStorage.getItem(key);
    if (!data) {
        localStorage.setItem(key, JSON.stringify(defaultVal));
        return defaultVal;
    }
    return JSON.parse(data);
};

const setLocalData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// Initial Seed Data
const initialEmployees = [
    { id: 1, name: "John Doe", email: "john@cms.com", role: "agent", status: "active" },
    { id: 2, name: "Sarah Connor", email: "sarah@cms.com", role: "agent", status: "active" }
];

const initialCustomers = [
    { id: 1, customer_code: "C001", name: "Rahul Sharma", dob: "1990-05-15", phone: "9876543210", email: "rahul@gmail.com", address: "Mumbai, India" },
    { id: 2, customer_code: "C002", name: "Priya Patel", dob: "1993-10-22", phone: "8765432109", email: "priya@gmail.com", address: "Gujarat, India" },
    { id: 3, customer_code: "C003", name: "Amit Kumar", dob: "1988-02-05", phone: "7654321098", email: "amit@gmail.com", address: "Delhi, India" }
];

const initialPolicies = [
    { id: 1, customer_id: 1, policy_type: "Health Insurance", policy_number: "POL1001", premium_amount: 12000, start_date: "2026-01-01", end_date: "2027-01-01", status: "active" },
    { id: 2, customer_id: 2, policy_type: "Life Insurance", policy_number: "POL1002", premium_amount: 25000, start_date: "2026-02-15", end_date: "2027-02-15", status: "active" },
    { id: 3, customer_id: 3, policy_type: "Motor Insurance", policy_number: "POL1003", premium_amount: 8500, start_date: "2025-05-01", end_date: "2026-05-01", status: "expired" }
];

const initialClaims = [
    { id: 1, policy_id: 1, claim_amount: 5000, reason: "Hospitalization", status: "verified", submission_date: "2026-06-10", assigned_to: 1 },
    { id: 2, policy_id: 2, claim_amount: 15000, reason: "Critical Illness", status: "pending", submission_date: "2026-07-20", assigned_to: null }
];

const initialPayments = [
    { id: 1, policy_id: 1, payment_date: "2026-01-02", amount: 12000, payment_status: "paid" },
    { id: 2, policy_id: 2, payment_date: "2026-02-16", amount: 25000, payment_status: "paid" },
    { id: 3, policy_id: 3, payment_date: "", amount: 8500, payment_status: "overdue" }
];

const initialDocuments = [
    { id: 1, customer_id: 1, file_name: "rahul_pan.pdf", file_path: "/docs/rahul_pan.pdf", uploaded_at: "2026-01-01 10:30" },
    { id: 2, customer_id: 2, file_name: "priya_aadhaar.pdf", file_path: "/docs/priya_aadhaar.pdf", uploaded_at: "2026-02-15 14:20" }
];

// Initialize local DBs
getLocalData("insurance_employees", initialEmployees);
getLocalData("insurance_customers", initialCustomers);
getLocalData("insurance_policies", initialPolicies);
getLocalData("insurance_claims", initialClaims);
getLocalData("insurance_payments", initialPayments);
getLocalData("insurance_documents", initialDocuments);

const api = {
    // Interceptors mock interface
    interceptors: {
        request: {
            use: () => {}
        }
    },

    // POST calls
    post: async (url, data) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 1. LOGIN ENDPOINT
                if (url.includes("/auth/login")) {
                    const { email, password } = data;
                    let role = "";
                    let name = "";
                    
                    if (password === "12345") {
                        role = "admin";
                        name = "System Admin";
                    } else if (password === "09876") {
                        role = "agent";
                        name = "Field Agent";
                    } else if (password === "10298") {
                        role = "customer";
                        name = "Premium Customer";
                    } else {
                        return reject({
                            response: { data: { message: "Invalid Password! Try 12345 (admin), 09876 (agent), or 10298 (customer)" } }
                        });
                    }

                    resolve({
                        data: {
                            token: `mock-jwt-token-for-${role}`,
                            role: role,
                            user: {
                                id: role === "admin" ? 100 : role === "agent" ? 1 : 1, // mapping customer ID to customer_id 1
                                name: name,
                                email: email || `${role}@cms.com`,
                                role: role
                            }
                        }
                    });
                }
                
                // 2. CREATE CUSTOMER
                else if (url.endsWith("/customers")) {
                    const customers = getLocalData("insurance_customers", initialCustomers);
                    const newCustomer = {
                        id: customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1,
                        ...data
                    };
                    customers.push(newCustomer);
                    setLocalData("insurance_customers", customers);
                    resolve({ data: newCustomer });
                }

                // 3. CREATE EMPLOYEE
                else if (url.endsWith("/employees")) {
                    const employees = getLocalData("insurance_employees", initialEmployees);
                    const newEmployee = {
                        id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
                        ...data,
                        status: "active"
                    };
                    employees.push(newEmployee);
                    setLocalData("insurance_employees", employees);
                    resolve({ data: newEmployee });
                }

                // 4. CREATE POLICY
                else if (url.endsWith("/policies")) {
                    const policies = getLocalData("insurance_policies", initialPolicies);
                    const newPolicy = {
                        id: policies.length > 0 ? Math.max(...policies.map(p => p.id)) + 1 : 1,
                        ...data,
                        status: "active"
                    };
                    policies.push(newPolicy);
                    setLocalData("insurance_policies", policies);
                    
                    // Create an initial unpaid or pending payment record
                    const payments = getLocalData("insurance_payments", initialPayments);
                    payments.push({
                        id: payments.length > 0 ? Math.max(...payments.map(py => py.id)) + 1 : 1,
                        policy_id: newPolicy.id,
                        payment_date: "",
                        amount: newPolicy.premium_amount,
                        payment_status: "pending"
                    });
                    setLocalData("insurance_payments", payments);

                    resolve({ data: newPolicy });
                }

                // 5. SUBMIT CLAIM
                else if (url.endsWith("/claims")) {
                    const claims = getLocalData("insurance_claims", initialClaims);
                    const newClaim = {
                        id: claims.length > 0 ? Math.max(...claims.map(cl => cl.id)) + 1 : 1,
                        ...data,
                        status: "pending",
                        assigned_to: null,
                        submission_date: new Date().toISOString().split("T")[0]
                    };
                    claims.push(newClaim);
                    setLocalData("insurance_claims", claims);
                    resolve({ data: newClaim });
                }

                // 6. UPLOAD DOCUMENT
                else if (url.endsWith("/documents")) {
                    const documents = getLocalData("insurance_documents", initialDocuments);
                    const newDoc = {
                        id: documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1,
                        customer_id: data.customer_id || 1,
                        file_name: data.file_name || "document.pdf",
                        file_path: `/docs/${data.file_name || "document.pdf"}`,
                        uploaded_at: new Date().toISOString().replace("T", " ").slice(0, 16)
                    };
                    documents.push(newDoc);
                    setLocalData("insurance_documents", documents);
                    resolve({ data: newDoc });
                }

                // 7. RECORD PAYMENT
                else if (url.endsWith("/payments")) {
                    const payments = getLocalData("insurance_payments", initialPayments);
                    const newPayment = {
                        id: payments.length > 0 ? Math.max(...payments.map(py => py.id)) + 1 : 1,
                        ...data,
                        payment_date: new Date().toISOString().split("T")[0],
                        payment_status: "paid"
                    };
                    payments.push(newPayment);
                    setLocalData("insurance_payments", payments);

                    // Update policy status to active if it was expired or pending
                    const policies = getLocalData("insurance_policies", initialPolicies);
                    const policyIndex = policies.findIndex(p => p.id === Number(data.policy_id));
                    if (policyIndex !== -1) {
                        policies[policyIndex].status = "active";
                        setLocalData("insurance_policies", policies);
                    }

                    resolve({ data: newPayment });
                }
                
                else {
                    reject({ response: { data: { message: "Endpoint not found" } } });
                }
            }, 300);
        });
    },

    // GET calls
    get: async (url) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 1. GET EMPLOYEES
                if (url.includes("/employees")) {
                    const employees = getLocalData("insurance_employees", initialEmployees);
                    resolve({ data: employees });
                }
                
                // 2. GET CUSTOMERS
                else if (url.includes("/customers")) {
                    const customers = getLocalData("insurance_customers", initialCustomers);
                    resolve({ data: customers });
                }

                // 3. GET POLICIES
                else if (url.includes("/policies")) {
                    const policies = getLocalData("insurance_policies", initialPolicies);
                    resolve({ data: policies });
                }

                // 4. GET CLAIMS
                else if (url.includes("/claims")) {
                    const claims = getLocalData("insurance_claims", initialClaims);
                    resolve({ data: claims });
                }

                // 5. GET PAYMENTS
                else if (url.includes("/payments")) {
                    const payments = getLocalData("insurance_payments", initialPayments);
                    resolve({ data: payments });
                }

                // 6. GET DOCUMENTS
                else if (url.includes("/documents")) {
                    const documents = getLocalData("insurance_documents", initialDocuments);
                    resolve({ data: documents });
                }
                
                // 7. GET DASHBOARD
                else if (url.includes("/dashboard")) {
                    const customers = getLocalData("insurance_customers", initialCustomers);
                    const policies = getLocalData("insurance_policies", initialPolicies);
                    const claims = getLocalData("insurance_claims", initialClaims);
                    const payments = getLocalData("insurance_payments", initialPayments);
                    
                    const totalPremium = payments.filter(py => py.payment_status === "paid").reduce((sum, py) => sum + py.amount, 0);
                    const activePolicies = policies.filter(p => p.status === "active").length;
                    const expiredPolicies = policies.filter(p => p.status === "expired").length;
                    const pendingClaims = claims.filter(c => c.status === "pending").length;

                    resolve({
                        data: {
                            totalCustomers: customers.length,
                            totalPolicies: policies.length,
                            activePolicies: activePolicies,
                            expiredPolicies: expiredPolicies,
                            totalPremium: totalPremium,
                            pendingClaims: pendingClaims,
                            totalClaims: claims.length
                        }
                    });
                }
                
                else {
                    resolve({ data: [] });
                }
            }, 300);
        });
    },

    // PUT / EDIT calls
    put: async (url, data) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // EDIT CUSTOMER
                if (url.includes("/customers/")) {
                    const id = Number(url.split("/").pop());
                    const customers = getLocalData("insurance_customers", initialCustomers);
                    const idx = customers.findIndex(c => c.id === id);
                    if (idx !== -1) {
                        customers[idx] = { ...customers[idx], ...data };
                        setLocalData("insurance_customers", customers);
                        resolve({ data: customers[idx] });
                    } else {
                        reject({ response: { data: { message: "Customer not found" } } });
                    }
                }
                // EDIT EMPLOYEE
                else if (url.includes("/employees/")) {
                    const id = Number(url.split("/").pop());
                    const employees = getLocalData("insurance_employees", initialEmployees);
                    const idx = employees.findIndex(e => e.id === id);
                    if (idx !== -1) {
                        employees[idx] = { ...employees[idx], ...data };
                        setLocalData("insurance_employees", employees);
                        resolve({ data: employees[idx] });
                    } else {
                        reject({ response: { data: { message: "Employee not found" } } });
                    }
                }
                // EDIT POLICY (e.g. Renew/Cancel)
                else if (url.includes("/policies/")) {
                    const id = Number(url.split("/").pop());
                    const policies = getLocalData("insurance_policies", initialPolicies);
                    const idx = policies.findIndex(p => p.id === id);
                    if (idx !== -1) {
                        policies[idx] = { ...policies[idx], ...data };
                        setLocalData("insurance_policies", policies);
                        resolve({ data: policies[idx] });
                    } else {
                        reject({ response: { data: { message: "Policy not found" } } });
                    }
                }
                // EDIT CLAIM (e.g. Assign, Approve/Reject)
                else if (url.includes("/claims/")) {
                    const id = Number(url.split("/").pop());
                    const claims = getLocalData("insurance_claims", initialClaims);
                    const idx = claims.findIndex(c => c.id === id);
                    if (idx !== -1) {
                        claims[idx] = { ...claims[idx], ...data };
                        setLocalData("insurance_claims", claims);
                        resolve({ data: claims[idx] });
                    } else {
                        reject({ response: { data: { message: "Claim not found" } } });
                    }
                }
                else {
                    reject({ response: { data: { message: "Endpoint not found" } } });
                }
            }, 300);
        });
    },

    // DELETE calls
    delete: async (url) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (url.includes("/customers/")) {
                    const id = Number(url.split("/").pop());
                    let customers = getLocalData("insurance_customers", initialCustomers);
                    customers = customers.filter(c => c.id !== id);
                    setLocalData("insurance_customers", customers);
                    resolve({ data: { message: "Customer deleted successfully" } });
                }
                else if (url.includes("/employees/")) {
                    const id = Number(url.split("/").pop());
                    let employees = getLocalData("insurance_employees", initialEmployees);
                    employees = employees.filter(e => e.id !== id);
                    setLocalData("insurance_employees", employees);
                    resolve({ data: { message: "Employee deleted successfully" } });
                }
                else {
                    reject({ response: { data: { message: "Endpoint not found" } } });
                }
            }, 300);
        });
    }
};

export default api;