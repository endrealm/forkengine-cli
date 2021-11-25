import ora from "ora"

export async function spinnerWrapPromise(progressText: string, successText: string, errorText: string, promise: Promise<any>, onSucess?: () => void, onError?: () => void) {
    const spinner = ora({
        text: progressText
    }).start()

    try {
        await promise
        spinner.succeed(successText)
        if(onSucess) onSucess()
    } catch(e) {
        spinner.fail(errorText)
        if(onError) onError()
    }
}