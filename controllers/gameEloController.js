import GameElo from "../models/gameEloSchema.js";

export async function deleteGameEloRecord(req, res) {
    console.log("Trying to delete a gameElo record");
    const { _id } = req.params;

    console.log(`Attempting to delete game with _id: ${_id}`);

    try {
        const result = await GameElo.findByIdAndDelete(_id);
        res.json({
            message: "Deleted gameElo record",
            result: result,
        });
    } catch (err) {
        console.log(err);
        return res
            .status(400)
            .send(
                `There was an error trying to delete the gameElo record with _id: ${_id}. Are you suse that record exists?`
            );
    }
}
