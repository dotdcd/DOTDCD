export const addEmployee = async (req, res) => {
    try {
        return res.status(200).json(req.files);
    } catch (error) {
        console.log(error)
    }
}