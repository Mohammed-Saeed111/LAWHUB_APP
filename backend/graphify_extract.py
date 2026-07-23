import json
from graphify.extract import collect_files, extract
from pathlib import Path
import multiprocessing

if __name__ == '__main__':
    multiprocessing.freeze_support()

    code_files = [
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/app.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/config/db.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/controllers/auth.controller.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/controllers/case.controller.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/controllers/consultation.controller.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/controllers/favorite.controller.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/controllers/lawyer.controller.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/controllers/meta.controller.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/middlewares/auth.middleware.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/middlewares/error.middleware.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/middlewares/upload.middleware.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/middlewares/validate.middleware.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/models/article.model.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/models/case.model.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/models/category.model.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/models/consultation.model.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/models/favorite.model.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/models/lawyer.model.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/models/otp.model.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/models/review.model.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/models/user.model.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/routes/auth.routes.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/routes/case.routes.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/routes/consultation.routes.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/routes/favorite.routes.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/routes/index.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/routes/lawyer.routes.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/routes/meta.routes.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/server.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/services/email.service.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/services/otp.service.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/services/token.service.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/utils/ApiError.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/utils/asyncHandler.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/utils/generateOtp.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/utils/seed.js',
        'C:/Users/Mo/Music/LAWHUB_APP/backend/src/validators/auth.validators.js',
    ]

    files = [Path(f) for f in code_files]
    result = extract(files)

    out_dir = Path('C:/Users/Mo/Music/LAWHUB_APP/backend/graphify-out')
    out_dir.mkdir(exist_ok=True)
    (out_dir / 'graph_ast.json').write_text(json.dumps(result, indent=2))
    print('AST: ' + str(len(result['nodes'])) + ' nodes, ' + str(len(result['edges'])) + ' edges')
